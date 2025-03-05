import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import NoticeTimePicker from "./NoticeTimePicker";

interface DeliveryTimePickerProps {
  startTime: Date;
  setStartTime: (date: Date) => void;
  endTime: Date;
  setEndTime: (date: Date) => void;
  reservationChecked: boolean;
  setReservationChecked: (value: boolean) => void;
}

const DeliveryTimePicker: React.FC<DeliveryTimePickerProps> = ({
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  reservationChecked,
  setReservationChecked,
}) => {
  const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null);
  const [tempTime, setTempTime] = useState<Date | null>(null);
  const [showNoticeModal, setShowNoticeModal] = useState(false);

  const getTodayMinMaxTime = (time: Date) => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), today.getDate(), time.getHours(), time.getMinutes());
  };

  return (
    <View>
      <Text style={styles.label}>배달 요청 시간</Text>
      <View style={styles.timeInputContainer}>
        {/* 시작 시간 선택 */}
        <TouchableOpacity
          style={[styles.timeButton, !reservationChecked && styles.disabledButton]}
          onPress={() => {
            if (reservationChecked) {
              setTempTime(startTime);
              setShowPicker("start");
            }
          }}
        >
          <Ionicons name="time-outline" size={20} color={!reservationChecked ? "#bbb" : "#333"} />
          <Text style={[styles.timeText, !reservationChecked && styles.disabledText]}>
            {`${startTime.getHours()}시 ${startTime.getMinutes()}분`}
          </Text>
        </TouchableOpacity>

        {/* 종료 시간 선택 */}
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => {
            setTempTime(endTime);
            setShowPicker("end");
          }}
        >
          <Ionicons name="time-outline" size={20} color="#333" />
          <Text style={styles.timeText}>
            {`${endTime.getHours()}시 ${endTime.getMinutes()}분`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 배달 예약 체크박스 */}
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => {
          if (!reservationChecked) {
            setShowNoticeModal(true);
          } else {
            setReservationChecked(false);
          }
        }}
      >
        <View style={[styles.checkbox, reservationChecked && styles.checked]}>
          {reservationChecked && <Ionicons name="checkmark" size={14} color="white" />}
        </View>
        <Text style={styles.checkboxText}>배달 예약</Text>
      </TouchableOpacity>

      {/* 📌 모달을 활용한 DateTimePicker (확인 버튼 추가) */}
      {showPicker && (
        <Modal transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {showPicker === "start" ? "배달 시작 시간 선택" : "배달 종료 시간 선택"}
              </Text>

              <DateTimePicker
                value={tempTime || new Date()}
                mode="time"
                is24Hour={true}
                display="spinner"
                minimumDate={getTodayMinMaxTime(new Date(0, 0, 0, 0, 0))} // ✅ 최소: 오늘 00:00
                maximumDate={getTodayMinMaxTime(new Date(0, 0, 0, 23, 59))} // ✅ 최대: 오늘 23:59
                onChange={(event, selectedDate) => {
                  if (selectedDate) setTempTime(selectedDate);
                }}
              />

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowPicker(null)}
                >
                  <Text style={styles.cancelButtonText}>취소</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={() => {
                    if (tempTime) {
                      if (showPicker === "start") {
                        const todayStart = getTodayMinMaxTime(tempTime);
                        if (todayStart < new Date()) {
                          Alert.alert("유효하지 않은 시간", "현재 시간보다 이전 시간을 선택할 수 없습니다.");
                          return;
                        }
                        setStartTime(todayStart);
                        if (todayStart >= endTime) {
                          setEndTime(new Date(todayStart.getTime() + 60 * 60 * 1000));
                        }
                      } else {
                        const todayEnd = getTodayMinMaxTime(tempTime);
                        if (todayEnd <= startTime) {
                          Alert.alert("유효하지 않은 시간", "종료 시간은 시작 시간보다 늦어야 합니다.");
                          return;
                        }
                        setEndTime(todayEnd);
                      }
                    }
                    setShowPicker(null);
                  }}
                >
                  <Text style={styles.confirmButtonText}>확인</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* 📌 배달 예약 안내 모달 추가 */}
      <NoticeTimePicker
        visible={showNoticeModal}
        onClose={() => setShowNoticeModal(false)}
        onConfirm={() => {
          setShowNoticeModal(false);
          setReservationChecked(true);
        }}
      />
    </View>
  );
};

export default DeliveryTimePicker;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  timeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  timeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f8f8",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  disabledButton: {
    backgroundColor: "#e0e0e0",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 6,
  },
  disabledText: {
    color: "#aaa",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#8A67F8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checked: {
    backgroundColor: "#8A67F8",
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#8A67F8",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginLeft: 5,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 5,
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "bold",
  },
});