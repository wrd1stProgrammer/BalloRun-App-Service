import React from "react";
import Svg, { Circle } from "react-native-svg";

const PinIndicator = ({ color = "#007AFF", size = 8 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 8 8" fill="none">
      <Circle cx="4" cy="4" r="4" fill={color} />
    </Svg>
  );
};

export default PinIndicator;
