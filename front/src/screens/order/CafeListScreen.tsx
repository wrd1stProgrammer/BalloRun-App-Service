import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";

import { useNavigation } from "@react-navigation/native";
import { goBack, navigate } from "../../navigation/NavigationUtils";
import cafes from "../../componenets/cafe/cafeNameData";
import { useAppSelector } from "../../redux/config/reduxHook";
import { selectMenu } from "../../redux/reducers/menuSlice";

const CafeListScreen: React.FC = () => {
  const [isListView, setIsListView] = useState(true); // 리스트/지도 전환 상태
  const menu = useAppSelector(selectMenu);

  const renderCafeItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.cafeItem}
      onPress={() => navigate("CafeMenuListScreen", { cafeName: item.name })}
    >
      <Image source={item.icon} style={styles.cafeIcon} />
      <View style={styles.cafeDetails}>
        <Text style={styles.cafeName}>{item.name}</Text>
        <Text style={styles.cafeRating}>⭐ {item.rating}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주문하기</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigate("BasketScreen")}
        >
          <Ionicons name="cart-outline" size={24} color="white" />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{menu.items.length}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 뷰 전환 버튼 */}
      <View style={styles.toggleButtons}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            isListView ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsListView(true)}
        >
          <Text
            style={isListView ? styles.activeButtonText : styles.inactiveButtonText}
          >
            리스트로 주문하기
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            !isListView ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setIsListView(false)}
        >
          <Text
            style={!isListView ? styles.activeButtonText : styles.inactiveButtonText}
          >
            지도로 주문하기
          </Text>
        </TouchableOpacity>
      </View>

      {/* 리스트 또는 지도 표시 */}
      {isListView ? (
        <FlatList
          data={cafes}
          renderItem={renderCafeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      ) : (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 35.1595454, // 초기 지도 중심 (예: 광주)
            longitude: 126.8526012,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >

        </MapView>
      )}
    </View>
  );
};

export default CafeListScreen;

// 스타일
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  cartButton: {
    position: "relative",
    padding: 8,
    backgroundColor: "#6C63FF",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#A855F7",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cartBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  toggleButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#6C63FF",
  },
  inactiveButton: {
    backgroundColor: "#E5E7EB",
  },
  activeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  inactiveButtonText: {
    color: "#6B7280",
  },
  list: {
    paddingBottom: 16,
  },
  cafeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 8,
  },
  cafeIcon: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  cafeDetails: {
    flex: 1,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cafeRating: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  map: {
    flex: 1,
  },
});
