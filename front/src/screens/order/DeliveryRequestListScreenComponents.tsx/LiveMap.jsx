import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useLocationTracker } from "../../../utils/LocationTracker"; // utils에서 가져옴
import { goBack } from "../../../navigation/NavigationUtils";

function LiveMap() {
    const { userLocations } = useLocationTracker("user123"); // 사용자 ID 전달
    console.log(userLocations)
    return (
        <View style={{ flex: 1 }}>
            {/*  뒤로 가기 버튼 */}
            <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            {/*  Google Maps */}
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: 35.1767,
                    longitude: 126.9085,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {/*  사용자 위치 마커 표시 */}
                {Object.values(userLocations).map((user) => (
                    
                    <Marker
                        key={user.userId}
                        coordinate={{
                            latitude: user.latitude,
                            longitude: user.longitude,
                        }}
                        title={`User ${user.userId}`}
                        description="실시간 위치"
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 16,
        left: 16,
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        borderRadius: 20,
        padding: 8,
        zIndex: 10,
    },
});

export default LiveMap;
