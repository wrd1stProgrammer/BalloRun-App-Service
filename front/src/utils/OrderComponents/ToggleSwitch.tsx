import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface ToggleSwitchProps {
  isListView: boolean;
  onToggle: (viewType: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isListView, onToggle }) => {
  const tabIndicator = useRef(new Animated.Value(isListView ? 0 : width / 2)).current;

  useEffect(() => {
    Animated.timing(tabIndicator, {
      toValue: isListView ? 0 : width / 2, // 리스트 → 0, 지도 → width 절반만큼 이동
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isListView]);

  return (
    <View style={styles.toggleContainer}>
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => onToggle(true)}
        >
          <Text style={isListView ? styles.activeButtonText : styles.inactiveButtonText}>
            리스트로 보기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => onToggle(false)}
        >
          <Text style={!isListView ? styles.activeButtonText : styles.inactiveButtonText}>
            지도로 보기
          </Text>
        </TouchableOpacity>
      </View>
      {/* 애니메이션 바 */}
      <Animated.View
        style={[
          styles.underline,
          {
            transform: [{ translateX: tabIndicator }],
          },
        ]}
      />
    </View>
  );
};

export default ToggleSwitch;
const styles = StyleSheet.create({
    toggleContainer: {
      marginVertical: 16,
      alignItems: "center",
    },
    toggleButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      borderRadius: 8,
      overflow: "hidden",
    },
    toggleButton: {
      flex: 1,
      padding: 10,
      alignItems: "center",
    },
    activeButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#333",
    },
    inactiveButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#6B7280",
    },
    underline: {
      position: "absolute",
      bottom: -2, // 기존 스타일 유지
      left: 0,
      width: "50%", // 버튼 크기의 50% (절반 크기)
      height: 4,
      backgroundColor: "#6C63FF",
      borderRadius: 2,
    },
  });