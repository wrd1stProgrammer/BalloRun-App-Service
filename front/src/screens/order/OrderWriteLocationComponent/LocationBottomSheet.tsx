import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  setStartTime,
  setEndTime,
  setAddress,
  setDeliveryFee,
} from "../../../redux/reducers/orderSlice";
import { useAppSelector } from "../../../redux/config/reduxHook";
import { selectMenu } from "../../../redux/reducers/menuSlice";
import { orderNowHandler } from "../../../redux/actions/orderAction";
import { useContext } from "react";
import { WebSocketContext } from "../../../utils/Socket";
import { navigate } from "../../../navigation/NavigationUtils";

interface LocationBottomSheetProps {
  address: string;
  bottomSheetRef: React.RefObject<any>;
  deliveryMethod: "direct" | "cupHolder";
}

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  address,
  bottomSheetRef,
  deliveryMethod,
}) => {
  const dispatch = useAppDispatch();
  const menu = useAppSelector(selectMenu);
  const socket = useContext(WebSocketContext);

  const [startTime, setStartTimeLocal] = React.useState(new Date());
  const [endTime, setEndTimeLocal] = React.useState(
    new Date(new Date().getTime() + 60 * 60 * 1000)
  );
  const [deliveryFee, setDeliveryFeeLocal] = React.useState("1000");
  const [showStartPicker, setShowStartPicker] = React.useState(false);
  const [showEndPicker, setShowEndPicker] = React.useState(false);

  const handleSave = async () => {
    try {
      const [lat, lng] = address.split(",").map((s) => s.trim());
      if (!lat || !lng) {
        console.error("Invalid address format");
        return;
      }

      // Redux 상태 업데이트
      dispatch(setAddress({ lat, lng }));
      dispatch(setStartTime(startTime.getTime()));
      dispatch(setEndTime(endTime.getTime()));
      dispatch(setDeliveryFee(Number(deliveryFee)));

      if (!Array.isArray(menu.items)) {
        console.error("menu.items is not an array");
        return;
      }

      const isMatch = false;

      await dispatch(
        orderNowHandler(
          menu.items,
          lat,
          lng,
          startTime.getTime(),
          isMatch,
          deliveryMethod,
          Number(deliveryFee)
        )
      );

      // Navigate to the next screen and start loading
      navigate("DeliveryRequestListScreen", { loading: true });

      // Listen for socket response to stop loading
      socket?.on("emitMatchTest", () => {
        console.log("Socket response received");
        navigate("DeliveryRequestListScreen", { loading: false });
      });
    } catch (error) {
      console.error("Error during order request:", error);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={["25%", "43%"]}
      style={styles.bottomSheet}
    >
      <View style={styles.sheetContent}>
        <Text style={styles.label}>배달 상세 주소</Text>
        <TextInput
          style={[styles.input, styles.inputCompact]}
          value={address}
        />

        <Text style={styles.label}>배달 요청 시간</Text>
        <View style={styles.timeInputContainer}>
          <TouchableOpacity
            style={[styles.input, styles.timeInput]}
            onPress={() => setShowStartPicker(true)}
          >
            <Text
              style={styles.timeText}
            >{`${startTime.getHours()}시 ${startTime.getMinutes()}분`}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, styles.timeInput]}
            onPress={() => setShowEndPicker(true)}
          >
            <Text
              style={styles.timeText}
            >{`${endTime.getHours()}시 ${endTime.getMinutes()}분`}</Text>
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
              if (selectedDate) {
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
              if (selectedDate) setEndTimeLocal(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>배달비 설정</Text>
        <TextInput
          style={[styles.input, styles.inputCompact]}
          value={deliveryFee}
          onChangeText={setDeliveryFeeLocal}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE LOCATION</Text>
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
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
  },
  inputCompact: {
    padding: 8,
    marginBottom: 12,
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    color: "#333",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LocationBottomSheet;
