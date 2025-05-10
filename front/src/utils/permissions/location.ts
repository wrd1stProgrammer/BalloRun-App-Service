import { Platform, Alert } from "react-native";
import { PERMISSIONS, check, request, RESULTS } from "react-native-permissions";

export const requestLocationPermission = async (): Promise<boolean> => {
  const permission =
    Platform.OS === "ios"
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

  const result = await check(permission);

  if (result === RESULTS.GRANTED) {
    console.log("✅ 위치 권한이 이미 부여됨");
    return true;
  }

  if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
    const requestResult = await request(permission);
    if (requestResult === RESULTS.GRANTED) {
      console.log("✅ 위치 권한이 허용됨");
      return true;
    } else {
      console.log("❌ 위치 권한이 거부됨");
      Alert.alert("위치 권한 필요", "앱을 사용하려면 위치 권한을 허용해야 합니다.");
      return false;
    }
  }

  return false;
};
