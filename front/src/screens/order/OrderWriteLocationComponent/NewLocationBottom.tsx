import React, { useEffect, useState } from "react";
import { LatLng } from "react-native-maps";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch, useAppSelector } from "../../../redux/config/reduxHook";
import {
  setStartTime,
  setEndTime,
  setAddress,
  setDeliveryFee,
  setDeliveyRequest,
  setFloor,
} from "../../../redux/reducers/orderSlice";
import { selectMenu } from "../../../redux/reducers/menuSlice";
import { orderNowHandler, orderLaterHandler } from "../../../redux/actions/orderAction";
import { navigate } from "../../../navigation/NavigationUtils";
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from "react-native-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { reverseGeocode } from "../../../utils/Geolocation/reverseGeocode";
import { selectIsOngoingOrder, setIsOngoingOrder } from "../../../redux/reducers/userSlice";


export interface MarkerData {
  id: number;
  coordinate: LatLng;
  title: string;
  description: string;
  image: any;
  floors: string[];
}

interface NewLocationBottomProps {
  route: {
    params: {
      address: string;
      deliveryMethod: "direct" | "cupHolder";
      markers: MarkerData[];
      selectedMarker: MarkerData | null;
    };
  };
}


const NewLocationBottom: React.FC<NewLocationBottomProps> = ({ route }) => {
  const { address, deliveryMethod, markers, selectedMarker } = route.params;
  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);

  const [startTime, setStartTimeLocal] = useState(new Date());
  const [endTime, setEndTimeLocal] = useState(() => {
    const initialStartTime = new Date();
    return new Date(initialStartTime.getTime() + 60 * 60 * 1000);
  });
  const [deliveryFee, setDeliveryFeeLocal] = useState("500");
  const [deliveryRequest, setDeliberyRequest] = useState("없음");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reservationChecked, setReservationChecked] = useState(false);
  const [floor, setFloorState] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const [resolvedAddress, setResolvedAddress] = useState(address); // 상태 추가


  // lat, lng을 address로 변환 후 상태 업데이트
  useEffect(() => {
    const fetchAddress = async () => {
      if (!address.includes(",")) return; // 주소 형식이 lat, lng인지 확인

      const [lat, lng] = address.split(",").map((s) => s.trim());
      if (!lat || !lng) return;

      const fetchedAddress = await reverseGeocode(lat, lng);
      console.log(lat, lng)
      setResolvedAddress(fetchedAddress);
    };

    fetchAddress();
  }, [address]);




  useEffect(() => {
    if (!reservationChecked) {
      setStartTimeLocal(new Date());
    }
  }, [reservationChecked]);

  useEffect(() => {
    setFloorState(deliveryMethod === "cupHolder");
  }, [deliveryMethod]);

  const handleSave = async () => {
    try {
      const [lat, lng] = address.split(",").map((s) => s.trim());
      if (!lat || !lng) {
        console.error("Invalid address format");
        return;
      }

      dispatch(setAddress({ lat, lng }));
      dispatch(setStartTime(startTime.getTime()));
      dispatch(setEndTime(endTime.getTime()));
      dispatch(setDeliveryFee(Number(deliveryFee)));
      dispatch(setDeliveyRequest(deliveryRequest));
      dispatch(setFloor(selectedFloor));

      if (!Array.isArray(menu.items)) {
        console.error("menu.items is not an array");
        return;
      }


    
      


      const isMatch = false;
      if (reservationChecked) {
        await dispatch(
          orderLaterHandler(
            menu.items,
            lat,
            lng,
            resolvedAddress,
            startTime.getTime(),
            endTime.getTime(),
            isMatch,
            deliveryMethod,
            Number(deliveryFee),
            deliveryRequest,
            selectedFloor,
            menu.price,
            menu.quantitiy,
            selectedImageUri
          )
        );
      } else {
        await dispatch(
          orderNowHandler(
            menu.items,
            lat,
            lng,
            resolvedAddress,
            startTime.getTime(),
            endTime.getTime(),
            isMatch,
            deliveryMethod,
            Number(deliveryFee),
            deliveryRequest,
            selectedFloor,
            menu.price,
            menu.quantitiy,
            selectedImageUri
          )
        );
      }
      dispatch(setIsOngoingOrder(true));
      setTimeout(() => {
        navigate("BottomTab", { screen: "DeliveryRequestListScreen" });
      }, 1500);
    } catch (error) {
      console.error("Error during order request:", error);
    }
  };


  //이미지 등록 관련
  const handleImagePicker = async () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      includeBase64: true,
      selectionLimit: 1,
    };
  
    const response: ImagePickerResponse = await launchImageLibrary(options);
  
    if (response.didCancel) Alert.alert("사진 선택이 취소되었습니다.");
    else if (response.errorMessage) Alert.alert("에러 발생: " + response.errorMessage);
    else if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setSelectedImageUri(uri || null);
    }
  };
  
  // 📌 이미지 제거 기능
  const handleRemoveImage = () => {
    setSelectedImageUri(null);
  };
  
  // 📌 총 결제 금액 계산
  const totalAmount = menu.price + Number(deliveryFee);
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {!floor && (
          <>
            <Text style={styles.label}>배달 주소</Text>
            <TextInput style={styles.input} value={resolvedAddress} editable={false} />
            <Text style={styles.label}>배달 상세 주소 입력하기</Text>
            <TextInput style={styles.input} value={"상세 주소 입력"} />
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

        <Text style={styles.label}>배달비 설정</Text>
        <TextInput
          style={styles.input}
          value={deliveryFee}
          onChangeText={setDeliveryFeeLocal}
          keyboardType="numeric"
        />

        <Text style={styles.label}>배달 요청사항</Text>
        <TextInput
          style={styles.input}
          value={deliveryRequest}
          onChangeText={setDeliberyRequest}
        />


        
        <Text style={styles.label}>사진 첨부</Text>
    <TouchableOpacity
      onPress={selectedImageUri ? handleRemoveImage : handleImagePicker}
      style={styles.imagePicker}
    >
      <Ionicons
        name={selectedImageUri ? "close-circle" : "camera"}
        size={24}
        color={selectedImageUri ? "red" : "black"}
      />
    </TouchableOpacity>

    {/* 결제 금액 섹션 */}
    <Text style={styles.label}>결제 금액을 확인해주세요</Text>
    <View style={styles.paymentContainer}>
      <View style={styles.paymentRow}>
        <Text style={styles.paymentLabel}>상품 가격</Text>
        <Text style={styles.paymentValue}>{menu.price.toLocaleString()}원</Text>
      </View>
      <View style={styles.paymentRow}>
        <Text style={styles.paymentLabel}>배달팁</Text>
        <Text style={styles.paymentValue}>{deliveryFee}원</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.paymentRow}>
        <Text style={styles.paymentLabel}>총 결제예정금액</Text>
        <Text style={styles.paymentTotal}>{totalAmount.toLocaleString()}원</Text>
      </View>
    </View>

    {/* 개인정보 제3자 제공 동의 */}
    <View style={styles.paymentRow}>
      <Text style={styles.paymentLabel}>개인정보 제3자 제공 동의 -</Text>
    </View>

    <TouchableOpacity
          style={styles.saveButton}
          onPress={() => {
            if (floor && !selectedFloor) {
              alert("층을 선택해주세요!");
            } else {
              handleSave();
            }
          }}
        >
          <Text style={styles.saveButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  disabledTimeText: {
    color: "#a9a9a9",
  },
  content: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  pickerContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginBottom: 10,
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInput: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
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
  disabledTimeInput: {
    backgroundColor: "#d3d3d3",
  },
  imagePicker: {
    alignSelf: "center",
    marginBottom: 16,
  },
  paymentContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
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
});

export default NewLocationBottom;