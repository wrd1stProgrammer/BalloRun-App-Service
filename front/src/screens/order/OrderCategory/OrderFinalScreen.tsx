import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch, useAppSelector } from "../../../redux/config/reduxHook";
import { neworderCompleteHandler } from "../../../redux/actions/newOrderAction";
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import { uploadFile } from "../../../redux/actions/fileAction";
import { setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import { Picker } from "@react-native-picker/picker";
import Header from "../../../utils/OrderComponents/Header";
import Modal from 'react-native-modal';
import { selectUser } from "../../../redux/reducers/userSlice";
import { refetchUser } from "../../../redux/actions/userAction";
import { Payment, PortOneController } from '@portone/react-native-sdk';

type RootStackParamList = {
  OrderFinalScreen: {
    paymentId:string;
    name: string;
    orderDetails: string;
    priceOffer: string;
    deliveryFee: string;
    images: string;
    lat?: number;
    lng?: number;
    deliveryMethod: string;
    selectedMarker: any;
  };
  DeliveryNoticeScreen: undefined;
  CancelNoticeScreen: undefined;
  PortOneSample: {
    paymentId: string;
    orderName: string;
    totalAmount: number;
    easyPayProvider: string;
    orderDetails: any; // 주문 정보 전달
  };
};

type OrderFinalScreenRouteProp = RouteProp<RootStackParamList, "OrderFinalScreen">;

const MIN_POINT_USE = 3000; // 포인트 3000 이상부터 사용 가능
const MIN_CARD_PAY = 1000;  // 결제금액 최소 1000원

const OrderFinalScreen = () => {
  const route = useRoute<OrderFinalScreenRouteProp>();
  const { name, orderDetails, priceOffer, deliveryFee, images, deliveryMethod, selectedMarker } = route.params;

  const user = useAppSelector(selectUser);

  const [deliveryAddress, setDeliveryAddress] = useState(user?.detail || "없음");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [riderRequest, setRiderRequest] = useState(user.riderNote || "");
  const [floor, setFloorState] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [startTime, setStartTimeLocal] = useState(new Date());
  const [endTime, setEndTimeLocal] = useState(() => new Date(new Date().getTime() + 60 * 60 * 1000));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reservationChecked, setReservationChecked] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState(user?.address || "");
  const [points, setPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);
  const [paymentId, setPaymentId] = useState(""); // 테스트용 임시
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("EASY_PAY_PROVIDER_KAKAOPAY");

  const lat = user?.lat;
  const lng = user?.lng;

  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(user?.admin);
    if (user?.admin) {
      Alert.alert(
        'Test Account Notice',
        "This account is for App Review testing purposes only.\n\nRegardless of which payment method you select, no actual payment will be processed and your delivery request will be submitted immediately.\n\nPlease note that real payments are only available for users located in Korea.\nTo test real payment flows, please log in using a non-test account from the credentials we provided.\n\nThank you!"
      );
    }
  }, []);

  // paymentId 생성 함수
  const generatePaymentId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `pay_${timestamp}_${randomStr}`;
  };

  useEffect(() => {
    setPaymentId(generatePaymentId());
  }, []);

  useEffect(() => {
    if (user?.point !== undefined) {
      setPoints(user.point);
    }
  }, [user]);

  const finalLat = deliveryMethod === "cupHolder" ? selectedMarker.coordinate.latitude : user?.lat;
  const finalLng = deliveryMethod === "cupHolder" ? selectedMarker.coordinate.longitude : user?.lng;
  const finalAddress = deliveryMethod === "cupHolder" ? selectedMarker.title : deliveryAddress;

  useEffect(() => {
    if (!reservationChecked) setStartTimeLocal(new Date());
  }, [reservationChecked]);

  useEffect(() => {
    setFloorState(deliveryMethod === "cupHolder");
  }, [deliveryMethod]);

  const handleNextPress = async () => {
    setIsLoading(true);
    const imageResponse = images ? await dispatch(uploadFile(images, "neworderInfo_image")) : null;
    const imageResponse2 = selectedImageUri ? await dispatch(uploadFile(selectedImageUri, "neworderPickup_image")) : null;

    await dispatch(neworderCompleteHandler(
      paymentId,
      name,
      orderDetails,
      parseInt(priceOffer.replace("원", "").replace(",", "")),
      parseInt(deliveryFee.replace("원", "").replace(",", "")),
      riderRequest,
      imageResponse || "",
      imageResponse2 || "",
      finalLat?.toString() || "",
      finalLng?.toString() || "",
      finalAddress,
      deliveryMethod,
      startTime.getTime(),
      endTime.getTime(),
      selectedFloor,
      resolvedAddress,
      usedPoints
    ));
    await dispatch(refetchUser());
    dispatch(setIsOngoingOrder(true));
    setTimeout(() => {
      setIsLoading(false);
      navigate("BottomTab", { screen: "DeliveryRequestListScreen" });
    }, 1000);
  };

  const handleImagePicker = async () => {
    const options: ImageLibraryOptions = { mediaType: "photo", includeBase64: true, selectionLimit: 1 };
    const response: ImagePickerResponse = await launchImageLibrary(options);
    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error: ' + response.errorMessage);
    else if (response.assets && response.assets.length > 0) setSelectedImageUri(response.assets[0].uri || null);
  };

  const handleRemoveImage = () => setSelectedImageUri(null);

  const totalAmount = parseInt(priceOffer.replace("원", "").replace(",", "")) + parseInt(deliveryFee.replace("원", "").replace(",", ""));
  // 포인트 사용 최대치는 (결제금액-1000) 이하, 단 3000P 이상부터만 가능
  const maxPointUsable = points >= MIN_POINT_USE
    ? Math.min(points, Math.max(totalAmount - MIN_CARD_PAY, 0))
    : 0;
  const finalAmount = totalAmount - usedPoints;

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}시 ${minutes < 10 ? "0" : ""}${minutes}분`;
  };

  // 포인트 입력 핸들러 (최소/최대조건 적용)
  const handlePointsChange = (text: string) => {
    let numericValue = parseInt(text.replace(/[^0-9]/g, "")) || 0;
    if (points < MIN_POINT_USE) {
      setUsedPoints(0);
      return;
    }
    if (numericValue > maxPointUsable) {
      setUsedPoints(maxPointUsable);
    } else if (numericValue < 0) {
      setUsedPoints(0);
    } else {
      setUsedPoints(numericValue);
    }
  };

  // 전액 버튼도 동일
  const handleAllPoints = () => {
    setUsedPoints(maxPointUsable);
  };

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPaymentMethod(method);
  };

  const initiatePayment = () => {

    const orderDetailsData = {
      paymentId,
      name,
      orderDetails,
      priceOffer: parseInt(priceOffer.replace("원", "").replace(",", "")),
      deliveryFee: parseInt(deliveryFee.replace("원", "").replace(",", "")),
      riderRequest,
      images,
      selectedImageUri,
      finalLat: finalLat?.toString() || "",
      finalLng: finalLng?.toString() || "",
      finalAddress,
      deliveryMethod,
      startTime: startTime.getTime(),
      endTime: endTime.getTime(),
      selectedFloor,
      resolvedAddress,
      usedPoints,
    };
    if(user?.admin){
      handleNextPress();
    }else{
      if(selectedPaymentMethod === "CARD"){
        navigate("PortoneCard", {
          paymentId,
          orderName: name,
          totalAmount: finalAmount,
          orderDetails: orderDetailsData,
        });
      }else{
        navigate("PortoneSample", {
          paymentId,
          orderName: name,
          totalAmount: finalAmount,
          easyPayProvider: selectedPaymentMethod,
          orderDetails: orderDetailsData,
        });
      }
    }
    
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>주문 접수 중...</Text>
        </View>
      ) : (
        <>
          <Header title={name} />
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={{ flex: 1 }}>
                  {!floor && (
                    <>
                      <Text style={styles.sectionTitle}>배달 주소</Text>
                      <TextInput style={styles.input} value={user?.address} editable={false} />
                      <Text style={styles.sectionTitle}>상세 배달 주소</Text>
                      <View style={styles.addressInputContainer}>
                        <TextInput
                          style={[styles.textArea, styles.addressInput]}
                          placeholder="상세 배달 주소를 입력해주세요"
                          placeholderTextColor="#999"
                          multiline
                          value={deliveryAddress}
                          onChangeText={setDeliveryAddress}
                        />
                        <TouchableOpacity onPress={selectedImageUri ? handleRemoveImage : handleImagePicker} style={styles.cameraIcon}>
                          <Ionicons
                            name={selectedImageUri ? "close-outline" : "camera-outline"}
                            size={24}
                            color={selectedImageUri ? "#ff3b30" : "#000"}
                          />
                        </TouchableOpacity>
                      </View>
                    </>
                  )}

                  {floor && selectedMarker && (
                    <>
                      <Text style={styles.sectionTitle}>층 선택</Text>
                      <View style={styles.pickerContainer}>
                        <Picker selectedValue={selectedFloor} onValueChange={(itemValue) => setSelectedFloor(itemValue)}>
                          <Picker.Item label="층을 선택해주세요" value="" />
                          {selectedMarker.floors.map((floor: string) => (
                            <Picker.Item key={floor} label={floor} value={floor} />
                          ))}
                        </Picker>
                      </View>
                    </>
                  )}

                  <Text style={styles.sectionTitle}>배달 요청 시간</Text>
                  <View style={styles.timeContainer}>
                    <TouchableOpacity
                      style={[styles.timeInput, !reservationChecked && styles.disabledTimeInput]}
                      onPress={() => reservationChecked && setShowStartPicker(true)}
                    >
                      <Text style={[styles.timeText, !reservationChecked && styles.disabledText]}>
                        {formatTime(startTime)}
                      </Text>
                    </TouchableOpacity>
                    <Text style={styles.timeDivider}>~</Text>
                    <TouchableOpacity style={styles.timeInput} onPress={() => setShowEndPicker(true)}>
                      <Text style={styles.timeText}>{formatTime(endTime)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.toggleButton, reservationChecked && styles.toggleButtonActive]}
                      onPress={() => setReservationChecked(!reservationChecked)}
                    >
                      <Text style={[styles.toggleText, reservationChecked && styles.toggleTextActive]}>
                        예약
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {showStartPicker && reservationChecked && (
                    Platform.OS === 'ios' ? (
                      <Modal isVisible={true} onBackdropPress={() => setShowStartPicker(false)}>
                        <View style={styles.timePickerModal}>
                          <Text style={styles.timePickerTitle}>시작 시간 선택</Text>
                          <DateTimePicker
                            value={startTime}
                            mode="time"
                            is24Hour={true}
                            display="spinner"
                            onChange={(event, selectedDate) => {
                              if (selectedDate) {
                                setShowStartPicker(false);
                                if (selectedDate < new Date()) {
                                  Alert.alert("유효하지 않은 시간", "현재 시간보다 이전 시간을 선택할 수 없습니다.");
                                  return;
                                }
                                setStartTimeLocal(selectedDate);
                                if (selectedDate >= endTime) {
                                  setEndTimeLocal(new Date(selectedDate.getTime() + 60 * 60 * 1000));
                                }
                              }
                            }}
                          />
                        </View>
                      </Modal>
                    ) : (
                      <DateTimePicker
                        value={startTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowStartPicker(false);
                          if (selectedDate) {
                            if (selectedDate < new Date()) {
                              Alert.alert("유효하지 않은 시간", "현재 시간보다 이전 시간을 선택할 수 없습니다.");
                              return;
                            }
                            setStartTimeLocal(selectedDate);
                            if (selectedDate >= endTime) {
                              setEndTimeLocal(new Date(selectedDate.getTime() + 60 * 60 * 1000));
                            }
                          }
                        }}
                      />
                    )
                  )}
                  {showEndPicker && (
                    Platform.OS === 'ios' ? (
                      <Modal isVisible={true} onBackdropPress={() => setShowEndPicker(false)}>
                        <View style={styles.timePickerModal}>
                          <Text style={styles.timePickerTitle}>종료 시간 선택</Text>
                          <DateTimePicker
                            value={endTime}
                            mode="time"
                            is24Hour={true}
                            display="spinner"
                            onChange={(event, selectedDate) => {
                              if (selectedDate) {
                                setShowEndPicker(false);
                                if (selectedDate <= startTime) {
                                  Alert.alert("유효하지 않은 시간", "종료 시간은 시작 시간보다 늦어야 합니다.");
                                  return;
                                }
                                setEndTimeLocal(selectedDate);
                              }
                            }}
                          />
                        </View>
                      </Modal>
                    ) : (
                      <DateTimePicker
                        value={endTime}
                        mode="time"
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                          setShowEndPicker(false);
                          if (selectedDate) {
                            if (selectedDate <= startTime) {
                              Alert.alert("유효하지 않은 시간", "종료 시간은 시작 시간보다 늦어야 합니다.");
                              return;
                            }
                            setEndTimeLocal(selectedDate);
                          }
                        }}
                      />
                    )
                  )}

                  <Text style={styles.sectionTitle}>주문 요청사항</Text>
                  <TextInput
                    style={styles.textArea}
                    placeholder="요청사항을 입력해주세요"
                    placeholderTextColor="#999"
                    multiline
                    value={riderRequest}
                    onChangeText={setRiderRequest}
                  />

                  <View style={styles.pointsContainer}>
                    <Text style={styles.sectionTitle}>포인트 사용</Text>
                    <Text style={styles.pointsBalance}>보유 포인트: {points.toLocaleString()}P  (1000원 미만으로 포인트 사용 불가능)</Text>
                    <View style={styles.pointsInputContainer}>
                      <TextInput
                        style={[
                          styles.pointsInput,
                          points < MIN_POINT_USE && { backgroundColor: "#f2f2f2", color: "#aaa" }
                        ]}
                        placeholder="사용할 포인트를 입력하세요"
                        placeholderTextColor="#999"
                        keyboardType="numeric"
                        value={usedPoints.toString()}
                        editable={points >= MIN_POINT_USE}
                        onChangeText={handlePointsChange}
                      />
                      <TouchableOpacity
                        style={[
                          styles.pointsAllButton,
                          points < MIN_POINT_USE || maxPointUsable <= 0 ? { backgroundColor: "#ddd" } : {},
                        ]}
                        onPress={handleAllPoints}
                        disabled={points < MIN_POINT_USE || maxPointUsable <= 0}
                      >
                        <Text style={styles.pointsAllButtonText}>전액 사용</Text>
                      </TouchableOpacity>
                    </View>
                    {points < MIN_POINT_USE &&
                      <Text style={{ color: "#F00", marginTop: 8, fontSize: 13 }}>
                        포인트는 3,000P 이상부터 사용 가능
                      </Text>
                    }
                    {points >= MIN_POINT_USE && maxPointUsable <= 0 &&
                      <Text style={{ color: "#F00", marginTop: 8, fontSize: 13 }}>
                        결제금액 1,000원 이상 남겨야 카드 결제 가능합니다
                      </Text>
                    }
                  </View>

                  <View style={styles.paymentContainer}>
                    <View className="row">
                      <Text style={styles.paymentLabel}>결제 금액</Text>
                      <Text style={styles.paymentTotal}>{finalAmount.toLocaleString()}원</Text>
                    </View>
                    <View style={styles.paymentDetail}>
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentSubLabel}>총 금액</Text>
                        <Text style={styles.paymentSubValue}>{totalAmount.toLocaleString()}원</Text>
                      </View>
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentSubLabel}>메뉴 금액</Text>
                        <Text style={styles.paymentSubValue}>{parseInt(priceOffer.replace("원", "").replace(",", "")).toLocaleString()}원</Text>
                      </View>
                      <View style={styles.paymentRow}>
                        <Text style={styles.paymentSubLabel}>배달팁</Text>
                        <Text style={styles.paymentSubValue}>{parseInt(deliveryFee.replace("원", "").replace(",", "")).toLocaleString()}원</Text>
                      </View>
                      {usedPoints > 0 && (
                        <View style={styles.paymentRow}>
                          <Text style={styles.paymentSubLabel}>포인트 할인</Text>
                          <Text style={styles.discountValue}>-{usedPoints.toLocaleString()}원</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* ===== 결제 수단 선택 (UI 수정) ===== */}
                  <Text style={styles.sectionTitle}>결제 수단 선택</Text>
                  <View style={styles.paymentListContainer}>
                    {[
                      {
                        key: "EASY_PAY_PROVIDER_NAVERPAY",
                        label: "네이버페이",
                        icon: require("../../../assets/Icon/naverpay2.png")
                      },
                      {
                        key: "EASY_PAY_PROVIDER_TOSSPAY",
                        label: "토스페이",
                        icon: require("../../../assets/Icon/tosspay2.jpeg")
                      },
                      {
                        key: "EASY_PAY_PROVIDER_KAKAOPAY",
                        label: "카카오페이",
                        icon: require("../../../assets/Icon/kakao.png")
                      },
                      { key: "CARD", label: "신용/체크카드", icon: require("../../../assets/Icon/card.png") },
                    ].map((m) => (
                      <TouchableOpacity
                        key={m.key}
                        style={[
                          styles.paymentItem,
                          selectedPaymentMethod === m.key &&
                            styles.paymentItemSelected,
                        ]}
                        onPress={() => handlePaymentMethodSelect(m.key)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            selectedPaymentMethod === m.key &&
                              styles.radioOuterSelected,
                          ]}
                        >
                          {selectedPaymentMethod === m.key && (
                            <View style={styles.radioInner} />
                          )}
                        </View>
                        <Image source={m.icon} style={styles.paymentIcon} resizeMode="contain" />
                        <View style={styles.paymentTextGroup}>
                          <Text style={styles.paymentLabelText}>{m.label}</Text>
                          {m.discount && (
                            <View style={styles.discountBadge}>
                              <Text style={styles.discountBadgeText}>
                                {m.discount}
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.noticeRow} onPress={() => navigate("DeliveryNoticeScreen")}>
                    <Text style={styles.noticeText}>배달 상품 주의사항 동의</Text>
                    <Ionicons name="chevron-forward" size={16} color="#999" />
                  </TouchableOpacity>

                  <Text style={styles.confirmText}>위 내용을 확인하였으며 결제에 동의합니다</Text>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </KeyboardAvoidingView>
          <TouchableOpacity style={styles.kakaoPayButton} onPress={initiatePayment}>
            <Text style={styles.kakaoPayButtonText}>
              {finalAmount.toLocaleString()}원 {selectedPaymentMethod.split('_').pop()} 결제
            </Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fafafa",
  },
  textArea: {
    height: 80,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#333",
  },
  addressInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  addressInput: {
    flex: 1,
    marginBottom: 0,
  },
  cameraIcon: {
    padding: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    marginBottom: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  disabledTimeInput: {
    backgroundColor: "#f5f5f5",
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  disabledText: {
    color: "#999",
  },
  timeDivider: {
    fontSize: 16,
    color: "#666",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  toggleButtonActive: {
    backgroundColor: "#007aff",
  },
  toggleText: {
    fontSize: 14,
    color: "#666",
  },
  toggleTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  timePickerModal: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 20,
    alignItems: "center",
  },
  timePickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  pointsContainer: {
    marginBottom: 20,
  },
  pointsBalance: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  pointsInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pointsInput: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#333",
  },
  pointsAllButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#3384FF",
    borderRadius: 10,
  },
  pointsAllButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  paymentContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#fafafa",
    borderRadius: 10,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentDetail: {
    marginTop: 12,
  },
  paymentLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  paymentTotal: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3384FF",
  },
  paymentSubLabel: {
    fontSize: 14,
    color: "#666",
  },
  paymentSubValue: {
    fontSize: 14,
    color: "#333",
  },
  discountValue: {
    fontSize: 14,
    color: "#007aff",
    fontWeight: "600",
  },
  noticeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  noticeText: {
    fontSize: 16,
    color: "#333",
  },
  confirmText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginVertical: 20,
  },
  kakaoPayButton: {
    backgroundColor: "#FFE812",
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  kakaoPayButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3A1D1D",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
  paymentMethodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  paymentMethodButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  selectedPaymentMethod: {
    borderColor: "#3384FF",
    backgroundColor: "#f0f8ff",
  },
  paymentMethodText: {
    fontSize: 14,
    color: "#333",
  },
  paymentListContainer: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  paymentItemSelected: {},
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  radioOuterSelected: {
    borderColor: "#00C37A",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00C37A",
  },
  paymentIconPlaceholder: {
    width: 28,
    height: 28,
    marginRight: 14,
  },
  paymentTextGroup: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  paymentLabelText: {
    fontSize: 16,
    color: "#1a1a1a",
    flexShrink: 1,
  },
  discountBadge: {
    marginLeft: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: "#f0f8ff",
  },
  discountBadgeText: {
    fontSize: 12,
    color: "#3384FF",
    fontWeight: "600",
  },
  paymentIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});

export default OrderFinalScreen;
