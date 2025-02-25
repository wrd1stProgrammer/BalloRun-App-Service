import React, { useContext, useState } from "react";
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
} from "react-native";
import { LatLng } from "react-native-maps";

import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { neworderCompleteHandler } from "../../../redux/actions/newOrderAction";
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import { uploadFile } from "../../../redux/actions/fileAction";
import { setIsOngoingOrder } from "../../../redux/reducers/userSlice";
import { Picker } from "@react-native-picker/picker";
import { reverseGeocode } from "../../../utils/Geolocation/reverseGeocode";

interface MarkerData {
  id: number;
  coordinate: LatLng;
  title: string;
  description: string;
  image: any;
  floors: string[];
}

type RootStackParamList = {
  OrderFinalScreen: {
    name: string;
    orderDetails: string;
    priceOffer: string;
    deliveryFee: string;
    images: string;
    lat?: number;
    lng?: number;
    deliveryMethod: string
    selectedMarker: MarkerData | null;
    
  };
};

type OrderFinalScreenRouteProp = RouteProp<RootStackParamList, "OrderFinalScreen">;


const toKST = (date: Date) => {
  const offset = 9 * 60;
  return new Date(date.getTime() + offset * 60 * 1000);
};

const OrderFinalScreen = () => {
  const route = useRoute<OrderFinalScreenRouteProp>();
  const {
    name,
    orderDetails,
    priceOffer,
    deliveryFee,
    // riderRequest,
    images,
    lat,
    lng,
    deliveryMethod,
    selectedMarker
  } = route.params;

  const [deliveryAddress, setDeliveryAddress] = useState("없음");
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [riderRequest, setriderRequest] = useState<string>("");

  // 02/21 03:13 추가
  const [floor, setFloorState] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  const [startTime, setStartTimeLocal] = useState(toKST(new Date()));
  const [endTime, setEndTimeLocal] = useState(toKST(new Date(new Date().getTime() + 60 * 60 * 1000)));
  
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reservationChecked, setReservationChecked] = useState(false);

  const [resolvedAddress, setResolvedAddress] = useState(""); // 상태 추가

  const dispatch = useAppDispatch();

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    return `${ampm} ${formattedHours}시 ${minutes}분`;
  };

  // lat, lng을 address로 변환 후 상태 업데이트
  useEffect(() => {
    const fetchAddress = async () => {

      if (!lat || !lng) return;

      const fetchedAddress = await reverseGeocode(String(lat), String(lng));
      console.log(lat, lng)
      setResolvedAddress(fetchedAddress);
    };

    fetchAddress();
  }, []);


  useEffect(() => {
    if (!reservationChecked) {
      setStartTimeLocal(toKST(new Date()));
    }
  }, [reservationChecked]);
  useEffect(() => {
    setFloorState(deliveryMethod === "cupHolder");
    }, [deliveryMethod]);


  const handleNextPress = async () => {
    setIsLoading(true);
    
    const imageResponse = images ? await dispatch(uploadFile(images, "neworderInfo_image")) : null;
    const imageResponse2 = selectedImageUri ? await dispatch(uploadFile(selectedImageUri, "neworderPickup_image")) : null;




    const res = await dispatch(neworderCompleteHandler(
      name,
      orderDetails,
      parseInt(priceOffer.replace("원", "").replace(",", "")),
      parseInt(deliveryFee.replace("원", "").replace(",", "")),
      riderRequest,
      imageResponse || "",
      imageResponse2 || "",
      lat?.toString() || "",
      lng?.toString() || "",
      deliveryAddress,
      deliveryMethod,


      startTime.getTime(),
      endTime.getTime(),
      selectedFloor,
      resolvedAddress || ""
      
    ));
 


    // user model db엔 없지만 주문상태를 상태관리 하기 위한 dispatch임.
    //client 에서만 사용하는 isOngoinOrder 상태
    dispatch(setIsOngoingOrder(true));
    
    


    
  
    setTimeout(() => {

      setIsLoading(false);
      navigate("BottomTab", {
        screen: "DeliveryRequestListScreen",
      });
    }, 1000);
  };


  useEffect(() => {
    if (selectedImageUri) {
      console.log(selectedImageUri, 'image uri 정보');
    }
  }, [selectedImageUri]);

  const handleImagePicker = async () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      includeBase64: true,
      selectionLimit: 1,
    };

    const response: ImagePickerResponse = await launchImageLibrary(options);

    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error: ' + response.errorMessage);
    else if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setSelectedImageUri(uri || null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageUri(null);
  };

  const handleKakaoPay = () => {
    Alert.alert("카카오페이 결제", "카카오페이 결제가 진행됩니다.");
    // 여기에 카카오페이 결제 로직을 추가하세요.
  };

  // 총 금액 계산
  const totalAmount = parseInt(priceOffer.replace("원", "").replace(",", "")) + parseInt(deliveryFee.replace("원", "").replace(",", ""));

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>주문 접수 중...</Text>
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => goBack()}>
              <Ionicons name="chevron-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{name}</Text>
            <TouchableOpacity onPress={() => alert("고객센터 연결")}>
              <Text style={styles.customerCenterText}>고객센터</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
          {!floor && (
          <>
            <Text style={styles.label}>배달 주소</Text>
            <TextInput style={styles.input} value={resolvedAddress} editable={false} />
            <Text style={styles.sectionTitle}>상세 배달 주소</Text>
            <TextInput
              style={styles.textArea}
              placeholder="상세 배달 주소를 입력해주세요"
              placeholderTextColor="#B0B0B0"
              multiline
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
            />
          </>
        )}

        {floor && selectedMarker && (
          <>
            <Text style={styles.label}>층을 선택해주세요</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedFloor}
                onValueChange={(itemValue) => setSelectedFloor(itemValue)}
              >
                <Picker.Item label="층을 선택해주세요" value="" />
                {selectedMarker.floors.map((floor) => (
                  <Picker.Item key={floor} label={floor} value={floor} />
                ))}
              </Picker>
            </View>
          </>
        )}




<Text style={styles.label}>배달 요청 시간</Text>
        <View style={styles.timeInputContainer}>
          <TouchableOpacity
            style={[
              styles.input,
              styles.timeInput,
              !reservationChecked && styles.disabledTimeInput,
            ]}
            onPress={() => {
              if (reservationChecked) setShowStartPicker(true);
            }}
          >
            <Text
              style={[
                styles.timeText_1,
                !reservationChecked && styles.disabledTimeText,
              ]}
            >
              {`${startTime.getFullYear()}년 ${startTime.getMonth() + 1
                }월 ${startTime.getDate()}일`}
            </Text>
            <Text
              style={[
                styles.timeText,
                !reservationChecked && styles.disabledTimeText,
              ]}
            >
              {`${startTime.getHours()}시 ${startTime.getMinutes()}분`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, styles.timeInput]}
            onPress={() => {
              setShowEndPicker(true);
            }}
          >
            <Text style={styles.timeText_1}>
              {`${endTime.getFullYear()}년 ${endTime.getMonth() + 1
                }월 ${endTime.getDate()}일`}
            </Text>

            <Text style={[styles.timeText]}>
              {`${endTime.getHours()}시 ${endTime.getMinutes()}분`}
            </Text>
          </TouchableOpacity>

          <View style={styles.checkboxWrapper}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setReservationChecked(!reservationChecked)}
            >
              <View
                style={[
                  styles.checkbox,
                  reservationChecked && styles.checkboxChecked,
                ]}
              />
              <Text style={styles.checkboxText}>배달 예약</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showStartPicker && reservationChecked && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                if (selectedDate < new Date()) {
                  Alert.alert(
                    "유효하지 않은 시간",
                    "현재 시간보다 이전 시간을 선택할 수 없습니다."
                  );
                  return;
                }
                setStartTimeLocal(selectedDate);
                if (selectedDate >= endTime) {
                  setEndTimeLocal(
                    new Date(selectedDate.getTime() + 60 * 60 * 1000)
                  );
                }
              }
            }}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                if (selectedDate <= startTime) {
                  Alert.alert(
                    "유효하지 않은 시간",
                    "종료 시간은 시작 시간보다 늦어야 합니다."
                  );
                  return;
                }
                setEndTimeLocal(selectedDate);
              }
            }}
          />
        )}

                   <TextInput
          style={styles.textArea}
          placeholder="주문 요청사항 입력"
          placeholderTextColor="#B0B0B0"
          multiline
          value={riderRequest}
          onChangeText={setriderRequest}
        />

            <Text style={styles.sectionTitle}>사진 첨부</Text>
            <TouchableOpacity
              onPress={selectedImageUri ? handleRemoveImage : handleImagePicker}
            >
              <Ionicons
                name={selectedImageUri ? "close-circle" : "camera"}
                size={24}
                color={selectedImageUri ? "red" : "black"}
              />
            </TouchableOpacity>

            {/* 결제 금액 섹션 */}
            <Text style={styles.sectionTitle}>결제금액을 확인해주세요</Text>
            <View style={styles.paymentContainer}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>상품 가격</Text>
                <Text style={styles.paymentValue}>{priceOffer}</Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>배달팁</Text>
                <Text style={styles.paymentValue}>{deliveryFee}</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>총 결제예정금액</Text>
                <Text style={styles.paymentTotal}>{totalAmount.toLocaleString()}원</Text>
              </View>

              
            </View>

            {/* 카카오페이 결제 버튼 */}


            <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>개인정보 제3자 제공 동의 -</Text>
              </View>
              
          </ScrollView>
          
          <TouchableOpacity
              style={styles.kakaoPayButton}
              onPress={handleNextPress}
            >
              <Text style={styles.kakaoPayButtonText}>카카오페이로 결제하기</Text>
            </TouchableOpacity>

        </>
        
      )}
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  pickerContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  customerCenterText: {
    fontSize: 14,
    color: "#555",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  optionButtonActive: {
    borderColor: "#000",
    backgroundColor: "#000",
  },
  optionText: {
    fontSize: 14,
    color: "#000",
  },
  optionTextActive: {
    color: "#fff",
  },
  datePickerContainer: {
    marginBottom: 20,
  },
  datePickerText: {
    fontSize: 16,
    color: "#000",
    padding: 10,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
  },
  timeDisplayText: {
    fontSize: 16,
    color: "#000",
    padding: 10,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: "#000",
  },
  buttonInactive: {
    backgroundColor: "#D3D3D3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#000",
  },
  paymentContainer: {
    marginBottom: 20,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#555",
  },
  paymentValue: {
    fontSize: 14,
    color: "#000",
  },
  paymentTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },
  kakaoPayButton: {
    backgroundColor: "#FFE812",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  kakaoPayButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3A1D1D",
  },

  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  timeInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  disabledTimeInput: {
    backgroundColor: "#d3d3d3",
  },
  timeText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
  timeText_1: {
    color: "#555",
    fontSize: 12,
  },
  checkboxWrapper: {
    justifyContent: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#6200ee",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#6200ee",
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
  },
  disabledTimeText: {
    color: "#a9a9a9",
  },
});

export default OrderFinalScreen;