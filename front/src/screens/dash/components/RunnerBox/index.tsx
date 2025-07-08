import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "./style";

interface RunnerBoxProps {
  runnerCount: number | null;
  runnerLoading: boolean;
  onPress: () => void;
}

const RunnerBox: React.FC<RunnerBoxProps> = ({
  runnerCount,
  runnerLoading,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.runnerBox}
    activeOpacity={0.85}
    onPress={onPress}
  >
    <View style={styles.runnerInner}>
      <View style={styles.runnerIconCircle}>
        <Icon name="run-fast" size={20} color="#26a69a" />
      </View>
      <Text style={styles.runnerLabel}>주변 러너 </Text>
      <Text style={styles.runnerCountText}>
        {runnerLoading ? (
          <Text style={{ fontSize: 13, color: "#26a69a" }}>조회중...</Text>
        ) : (
          <>
            <Text
              style={{ fontWeight: "bold", fontSize: 17, color: "#009688" }}
            >
              {runnerCount !== null ? runnerCount : "?"}
            </Text>
            <Text style={{ fontSize: 13, color: "#26a69a", fontWeight: "600" }}>
              {" "}
              명
            </Text>
          </>
        )}
      </Text>
    </View>
  </TouchableOpacity>
);

export default RunnerBox;
