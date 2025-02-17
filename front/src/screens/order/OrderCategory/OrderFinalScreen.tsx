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
  ActivityIndicator, // 로딩 화면을 위해 추가
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
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null); // uri만 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const dispatch = useAppDispatch();

  // 현재 시간을 "오후/오전 몇시 몇분" 형식으로 반환
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "오후" : "오전";
    const formattedHours = hours % 12 || 12;
    return `${ampm} ${formattedHours}시 ${minutes}분`;
  };

  const handleNextPress = async () => {
    setIsLoading(true); // 로딩 시작

    // 업로드 먼저 하고 클라우디나리 url을 NewOrder에 저장함 동시에 할까..?
    const imageResponse = await dispatch(uploadFile(images, "neworderInfo_image"));
    const imageResponse2 = await dispatch(uploadFile(images, "neworderPickup_image"));

    const res = await dispatch(neworderCompleteHandler(
      name,
      orderDetails,
      parseInt(priceOffer.replace("원", "").replace(",", "")), // Converting the priceOffer to a number
      parseInt(deliveryFee.replace("원", "").replace(",", "")), // Converting the deliveryFee to a number
      riderRequest,
      imageResponse, // orderpagescreen 첨부 이미지
      imageResponse2 || "", // 수령 위치 참고사진 (uri만 전달)
      lat?.toString() || "", // lat as string
      lng?.toString() || "", // lng as string
      deliveryType, // 'direct' or 'nonContact'
      pickupTime === "now" ? new Date() : pickupDate, // either current time or reservation time
      deliveryAddress,
      pickupTime === "now" ? formatTime(new Date()) : formatTime(pickupDate) // pickup time display
    ));

    // 위 비동기 작업 3개 끝나면 1초 후에 화면 전환! db 저장 성공 
    setTimeout(() => {
      setIsLoading(false); // 로딩 종료
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
      setSelectedImageUri(uri || null); // uri만 저장
    }
  };

  const handleRemoveImage = () => {
    setSelectedImageUri(null); // 이미지 uri 상태를 null로 설정하여 제거
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
                    mode="time" // 시간만 선택할 수 있도록 mode를 "time"으로 설정
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
          </ScrollView>

          <TouchableOpacity
            style={[styles.button, deliveryAddress ? styles.buttonActive : styles.buttonInactive]}
            disabled={!deliveryAddress}
            onPress={handleNextPress}
          >
            <Text style={styles.buttonText}>다음</Text>
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
});

export default OrderFinalScreen;