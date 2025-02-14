import React, { useEffect, useState } from "react";
import { LatLng } from 'react-native-maps';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  setStartTime,
  setEndTime,
  setAddress,
  setDeliveryFee,
  setDeliveyRequest,
  selectOrder,
  setFloor,
} from "../../../redux/reducers/orderSlice";
import { useAppSelector } from "../../../redux/config/reduxHook";
import { selectMenu } from "../../../redux/reducers/menuSlice";
import {
  orderNowHandler,
  orderLaterHandler,
} from "../../../redux/actions/orderAction";
import { useContext } from "react";
import { WebSocketContext } from "../../../utils/sockets/Socket";
import { navigate } from "../../../navigation/NavigationUtils";


export interface MarkerData {
  id: number;
  coordinate: LatLng;
  title: string;
  description: string;
  image: any;
  floors: string[]; // 층 데이터를 배열로 저장
}

interface LocationBottomSheetProps {
  address: string;
  bottomSheetRef: React.RefObject<any>;
  deliveryMethod: "direct" | "cupHolder";
  markers: MarkerData[];
  selectedMarker: MarkerData | null; // 선택된 마커 추가
}

const toKST = (date: Date) => {
  const offset = 9 * 60; // KST offset in minutes
  return new Date(date.getTime() + offset * 60 * 1000);
};

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  address,
  bottomSheetRef,
  deliveryMethod,
  markers,
  selectedMarker, // 선택된 마커
}) => {

  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);


  const [startTime, setStartTimeLocal] = useState(toKST(new Date()));
  const [endTime, setEndTimeLocal] = useState(
    toKST(new Date(new Date().getTime() + 60 * 60 * 1000))
  );
  const [deliveryFee, setDeliveryFeeLocal] = useState("500");
  const [deliveryRequest, setDeliberyRequest] = useState("없음");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [reservationChecked, setReservationChecked] = useState(false);
  const [floor, setfloor] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);
  // CustomMapView에서 선택한 층이이  여기가 선택한층인듯?


  useEffect(() => {
    if (!reservationChecked) {
      // 체크박스 해제 시 startTime을 다시 설정
      const now = toKST(new Date());
      setStartTimeLocal(now);
    }
  }, [reservationChecked]);

  useEffect(() => {
    if (deliveryMethod === "direct") {
      setfloor(false);
    } else {
      setfloor(true);
    }
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
      dispatch(setFloor(selectedFloor));  // 선택한 층을 보내야 함함


      if (!Array.isArray(menu.items)) {
        console.error("menu.items is not an array");
        return;
      }

      const isMatch = false;
      console.log(menu.items)
      if (reservationChecked) {
        console.log("지금배달 액션");
        await dispatch(
          orderLaterHandler(
            menu.items,
            lat,
            lng,
            startTime.getTime(),
            endTime.getTime(),
            isMatch,
            deliveryMethod,
            Number(deliveryFee),
            deliveryRequest,
            selectedFloor, //선택한 층을 보내야 함함

            menu.price,
            menu.quantitiy
          )
        );
      } else {
        console.log("예약배달 액션");
        await dispatch(
          orderNowHandler(
            menu.items,
            lat,
            lng,
            startTime.getTime(),
            endTime.getTime(),
            isMatch,
            deliveryMethod,
            Number(deliveryFee),
            deliveryRequest,
            selectedFloor, //선택한 층을 보내야 함함

            menu.price,
            menu.quantitiy
          )
        );
      }

      // 1.5초 뒤에 navigate 실행
      setTimeout(() => {
        navigate("BottomTab", {
          screen: "DeliveryRequestListScreen",
        });
      }, 1500); // 1500ms = 1.5초
    } catch (error) {
      console.error("Error during order request:", error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={2}
      snapPoints={["3%", "25%", "48%", "50","80"]}
      style={styles.bottomSheet}
    >
      <View style={styles.sheetContent}>
        {!floor && (
          <>
            <Text style={styles.label}>배달 상세 주소</Text>
            <TextInput
              style={[styles.input, styles.inputCompact]}
              value={address}
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

        <Text style={styles.label}>배달비 설정</Text>
        <TextInput
          style={[styles.input, styles.inputCompact]}
          value={deliveryFee}
          onChangeText={(text) => setDeliveryFeeLocal(text)}
          keyboardType="numeric"
        />

        <Text style={styles.label}>배달 요청사항</Text>
        <TextInput
          style={[styles.input, styles.inputCompact]}
          value={deliveryRequest}
          onChangeText={(text) => setDeliberyRequest(text)}
        />

        <TouchableOpacity style={styles.saveButton} onPress={() => {
          if (selectedFloor == null && floor==true) {
            alert("층을 선택해주세요!"); // 혹은 다른 처리
          } else {
            handleSave();
          }
        }}>
          <Text style={styles.saveButtonText}>결제하기</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

  },
  sheetContent: {
    flex: 1,
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
  inputCompact: {
    paddingLeft: 8,
    paddingTop: 3,
    paddingBottom: 3,
    marginBottom: 12,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  disabledTimeInput: {
    backgroundColor: "#d3d3d3",
  },
  timeText_1: {
    color: "#333",
    fontSize: 11,
  },
  timeText: {
    color: "#333",
    fontSize: 14,
  },
  disabledTimeText: {
    color: "#a9a9a9",
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
  saveButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  pickerContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default LocationBottomSheet;
