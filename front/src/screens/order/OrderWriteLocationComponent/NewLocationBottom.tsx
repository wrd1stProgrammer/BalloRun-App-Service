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

const toKST = (date: Date) => {
  const offset = 9 * 60;
  return new Date(date.getTime() + offset * 60 * 1000);
};

const NewLocationBottom: React.FC<NewLocationBottomProps> = ({ route }) => {
  const { address, deliveryMethod, markers, selectedMarker } = route.params;
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
  const [floor, setFloorState] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string | null>(null);

  useEffect(() => {
    if (!reservationChecked) {
      setStartTimeLocal(toKST(new Date()));
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
            startTime.getTime(),
            endTime.getTime(),
            isMatch,
            deliveryMethod,
            Number(deliveryFee),
            deliveryRequest,
            selectedFloor,
            menu.price,
            menu.quantitiy
          )
        );
      } else {
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
            selectedFloor,
            menu.price,
            menu.quantitiy
          )
        );
      }

      setTimeout(() => {
        navigate("BottomTab", { screen: "DeliveryRequestListScreen" });
      }, 1500);
    } catch (error) {
      console.error("Error during order request:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {!floor && (
          <>
            <Text style={styles.label}>배달 상세 주소</Text>
            <TextInput style={styles.input} value={address} editable={false} />
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
            style={styles.timeInput}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.timeText}>
              {`${startTime.getHours()}시 ${startTime.getMinutes()}분`}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.timeInput}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.timeText}>
              {`${endTime.getHours()}시 ${endTime.getMinutes()}분`}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartTimeLocal(selectedDate);
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
              if (selectedDate) setEndTimeLocal(selectedDate);
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
  disabledTimeText: {
    color: "#a9a9a9",
  },
});

export default NewLocationBottom;