import React from "react";
import Svg, { Path } from "react-native-svg";

const Bell16 = ({ color = "#777777", size = 16 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C10.9 2 10 2.9 10 4V4.3C6.6 5.2 4 8.1 4 12V17L2 19V20H22V19L20 17V12C20 8.1 17.4 5.2 14 4.3V4C14 2.9 13.1 2 12 2ZM12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22Z"
        fill={color}
      />
    </Svg>
  );
};

export default Bell16;
