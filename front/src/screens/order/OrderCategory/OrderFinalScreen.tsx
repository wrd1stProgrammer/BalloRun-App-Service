import React, { useState } from "react";
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
import { useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { neworderCompleteHandler } from "../../../redux/actions/newOrderAction";
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import { uploadFile } from "../../../redux/actions/fileAction";

type RootStackParamList = {
  OrderFinalScreen: {
    name: string;
    orderDetails: string;
    priceOffer: string;
    deliveryFee: string;
    riderRequest: string;
    images: string;
    lat?: number;
    lng?: number;
  };
};

type OrderFinalScreenRouteProp = RouteProp<RootStackParamList, "OrderFinalScreen">;

const OrderFinalScreen = () => {
  const route = useRoute<OrderFinalScreenRouteProp>();
  const {
    name,
    orderDetails,
    priceOffer,
    deliveryFee,
    riderRequest,
    images,
    lat,
    lng,
  } = route.params;

  const [deliveryType, setdeliveryType] = useState<"direct" | "nonContact">("direct");
  const [pickupTime, setPickupTime] = useState<"now" | "reservation">("now");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickupDate, setPickupDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    return `${ampm} ${formattedHours}시 ${minutes}분`;
  };

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
      deliveryType,
      pickupTime === "now" ? new Date() : pickupDate,
      deliveryAddress,
      pickupTime === "now" ? formatTime(new Date()) : formatTime(pickupDate)
    ));

    setTimeout(() => {
      setIsLoading(false);
      navigate("BottomTab", {
        screen: "DeliveryRequestListScreen",
      });
    }, 1000);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || pickupDate;
    setShowDatePicker(Platform.OS === "ios");
    setPickupDate(currentDate);
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
            <Text style={styles.sectionTitle}>수령 방법</Text>
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={[styles.optionButton, deliveryType === "direct" && styles.optionButtonActive]}
                onPress={() => setdeliveryType("direct")}
              >
                <Text style={[styles.optionText, deliveryType === "direct" && styles.optionTextActive]}>직접 수령</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, deliveryType === "nonContact" && styles.optionButtonActive]}
                onPress={() => setdeliveryType("nonContact")}
              >
                <Text style={[styles.optionText, deliveryType === "nonContact" && styles.optionTextActive]}>비대면 수령</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>픽업 시간</Text>
            <View style={styles.optionContainer}>
              <TouchableOpacity
                style={[styles.optionButton, pickupTime === "now" && styles.optionButtonActive]}
                onPress={() => setPickupTime("now")}
              >
                <Text style={[styles.optionText, pickupTime === "now" && styles.optionTextActive]}>지금 수령</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.optionButton, pickupTime === "reservation" && styles.optionButtonActive]}
                onPress={() => setPickupTime("reservation")}
              >
                <Text style={[styles.optionText, pickupTime === "reservation" && styles.optionTextActive]}>예약 수령</Text>
              </TouchableOpacity>
            </View>

            {pickupTime === "now" ? (
              <Text style={styles.timeDisplayText}>{formatTime(new Date())}</Text>
            ) : (
              <View style={styles.datePickerContainer}>
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                  <Text style={styles.datePickerText}>{formatTime(pickupDate)}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                  <DateTimePicker
                    value={pickupDate}
                    mode="time"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}
              </View>
            )}

            <Text style={styles.sectionTitle}>상세 배달 주소</Text>
            <TextInput
              style={styles.textArea}
              placeholder="상세 배달 주소를 입력해주세요"
              placeholderTextColor="#B0B0B0"
              multiline
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
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
              onPress={handleKakaoPay}
            >
              <Text style={styles.kakaoPayButtonText}>카카오페이로 결제하기</Text>
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
});

export default OrderFinalScreen;