import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface OrderOptionProps {
  requiredOptions?: string[]; // 필수 옵션 리스트
  selectedRequiredOption: string | null;
  setSelectedRequiredOption: (option: string) => void;

  additionalOptions?: { name: string; price: number }[]; // 추가 옵션 리스트
  selectedAdditionalOptions: string[];
  setSelectedAdditionalOptions: (option: string) => void;
}

const OrderOption: React.FC<OrderOptionProps> = ({
  requiredOptions = [],
  selectedRequiredOption,
  setSelectedRequiredOption,

  additionalOptions = [],
  selectedAdditionalOptions,
  setSelectedAdditionalOptions,
}) => {

  // 필수 옵션 선택
  const handleRequiredOptionSelect = (option: string) => {
    setSelectedRequiredOption(option);
  };

  // 추가 옵션 선택/해제
  const handleAdditionalOptionToggle = (option: string) => {
    setSelectedAdditionalOptions((prevOptions) =>
      prevOptions.includes(option)
        ? prevOptions.filter((o) => o !== option)
        : [...prevOptions, option]
    );
  };

  return (
    <View>
      {/* 필수 옵션 */}
      <Text style={styles.sectionTitle}>필수 옵션</Text>
      {requiredOptions.length > 0 ? (
        requiredOptions.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selectedRequiredOption === option && styles.selectedOption,
            ]}
            onPress={() => handleRequiredOptionSelect(option)}
          >
            <Text style={selectedRequiredOption === option ? styles.selectedText : styles.optionText}>
              {option}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noOptionsText}>필수 옵션이 없습니다.</Text>
      )}

      {/* 추가 옵션 */}
      <Text style={styles.sectionTitle}>추가 옵션</Text>
      {additionalOptions.length > 0 ? (
        additionalOptions.map(({ name, price }) => (
          <TouchableOpacity
            key={name}
            style={[
              styles.optionButton,
              selectedAdditionalOptions.includes(name) && styles.selectedOption,
            ]}
            onPress={() => handleAdditionalOptionToggle(name)}
          >
            <Text style={selectedAdditionalOptions.includes(name) ? styles.selectedText : styles.optionText}>
              {name} (+{price.toLocaleString()}원)
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noOptionsText}>추가 옵션이 없습니다.</Text>
      )}
    </View>
  );
};

export default OrderOption;

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    color: "#333333",
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F9F9F9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedOption: {
    backgroundColor: "#8A67F8",
    borderColor: "#8A67F8",
  },
  optionText: {
    color: "#333",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noOptionsText: {
    color: "#888",
    fontSize: 14,
    marginBottom: 8,
  },
});