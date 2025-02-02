import React from "react";
import Svg, { Path } from "react-native-svg";

const FillPin24 = ({ color = "#007AFF", size = 24 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C13.1 2 14 2.9 14 4V12L16.5 13.5C17 13.8 17 14.5 16.5 14.8L12 18V22H10V18L5.5 14.8C5 14.5 5 13.8 5.5 13.5L8 12V4C8 2.9 8.9 2 10 2H12Z"
        fill={color}
      />
    </Svg>
  );
};

export default FillPin24;
