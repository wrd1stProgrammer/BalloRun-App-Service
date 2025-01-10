import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

type LocationBottomSheetProps = {
  address: string;
  setAddress: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  deliveryFee: string;
  setDeliveryFee: (value: string) => void;
  bottomSheetRef: React.RefObject<BottomSheet>;
};

const LocationBottomSheet: React.FC<LocationBottomSheetProps> = ({
  address,
  setAddress,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  deliveryFee,
  setDeliveryFee,
  bottomSheetRef,
}) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0} // 기본적으로 활성화된 상태
      snapPoints={['25%', '40%']}
      style={styles.bottomSheet}
    >
      <View style={styles.sheetContent}>
        <Text style={styles.label}>배달 상세 주소</Text>
        <TextInput
          style={[styles.input, styles.inputCompact]}
          value={address}
          onChangeText={setAddress}
        />

        <Text style={styles.label}>배달 요청 시간</Text>
        <View style={styles.timeInputContainer}>
          <TextInput
            style={[styles.input, styles.timeInput, styles.inputCompact]}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="시작 시간"
          />
          <TextInput
            style={[styles.input, styles.timeInput, styles.inputCompact]}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="종료 시간"
          />
        </View>

        <Text style={styles.label}>배달비 설정</Text>
        <TextInput
          style={[styles.input, styles.inputCompact]}
          value={deliveryFee}
          onChangeText={setDeliveryFee}
          keyboardType="numeric"
        />

        <TouchableOpacity style={[styles.saveButton, styles.buttonCompact]}>
          <Text style={styles.saveButtonText}>SAVE LOCATION</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sheetContent: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f2f2f2',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonCompact: {
    paddingVertical: 10,
    marginTop: 12,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LocationBottomSheet;
