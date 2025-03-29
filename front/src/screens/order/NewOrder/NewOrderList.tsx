import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NewOrderDetailModal = ({ onClose, onAccept, deliveryItem }) => {
  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* 기존 ScrollView 내부 내용 */}
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>닫기</Text>
          </TouchableOpacity>
          
            <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
              <Text style={styles.buttonText}>배달하기</Text>
            </TouchableOpacity>
          
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E8ECEF",
  },
  // Other styles...
});

export default NewOrderDetailModal;