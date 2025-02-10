import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
} from "react-native";

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: string; // 주문 유형
  startTime: string;
  deliveryFee: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
  isReservation: boolean;
};

type DeliveryCustomListProps = {
  deliveryItems: DeliveryItem[];
  userLat: number;
  userLng: number;
};

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // 거리 (km)
}

function DeliveryCustomList({ deliveryItems, userLat, userLng }: DeliveryCustomListProps) {
  const [sortedItems, setSortedItems] = useState<DeliveryItem[]>([]);
  const [sortCriteria, setSortCriteria] = useState<"distance" | "price">("distance");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let filteredItems = [...deliveryItems];

    // 1️⃣ 카페 이름으로 필터링
    if (searchQuery.trim() !== "") {
      filteredItems = filteredItems.filter((item) =>
        item.items[0].cafeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 2️⃣ 정렬 적용 (거리순 또는 가격순)
    if (sortCriteria === "distance") {
      filteredItems.sort((a, b) => {
        const distanceA = getDistance(userLat, userLng, parseFloat(a.lat), parseFloat(a.lng));
        const distanceB = getDistance(userLat, userLng, parseFloat(b.lat), parseFloat(b.lng));
        return distanceA - distanceB;
      });
    } else if (sortCriteria === "price") {
      filteredItems.sort((a, b) => a.deliveryFee - b.deliveryFee);
    }

    setSortedItems(filteredItems);
  }, [sortCriteria, searchQuery, deliveryItems, userLat, userLng]);

  const renderItem = ({ item }: { item: DeliveryItem }) => {
    const distance = getDistance(userLat, userLng, parseFloat(item.lat), parseFloat(item.lng)).toFixed(1);

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemDetails}>
          <Text style={styles.cafeName}>{item.items[0].cafeName}</Text>
          <Text style={styles.menu}>{item.items.map(i => `${i.menuName} x${i.quantity}`).join(", ")}</Text>
          <Text style={styles.info}>배달 유형: {item.deliveryType}</Text>
          <Text style={styles.info}>거리: {distance} km</Text>
          <Text style={styles.price}>배달비: {item.deliveryFee}원</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 1️⃣ 검색 입력 필드 */}
      <TextInput
        style={styles.searchInput}
        placeholder="카페 이름 검색..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />

      {/* 2️⃣ 정렬 옵션 버튼 */}
      <View style={styles.sortOptions}>
        <TouchableOpacity
          style={[styles.sortButton, sortCriteria === "distance" && styles.activeButton]}
          onPress={() => setSortCriteria("distance")}
        >
          <Text style={styles.sortText}>거리순</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortCriteria === "price" && styles.activeButton]}
          onPress={() => setSortCriteria("price")}
        >
          <Text style={styles.sortText}>가격순</Text>
        </TouchableOpacity>
      </View>

      {/* 3️⃣ 리스트 출력 */}
      <FlatList
        data={sortedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

export default DeliveryCustomList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 10,
  },
  sortOptions: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: "#e5e7eb",
  },
  activeButton: {
    backgroundColor: "#6C63FF",
  },
  sortText: {
    color: "#fff",
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#F8F8F8",
    borderRadius: 8,
    marginBottom: 8,
  },
  cafeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  menu: {
    fontSize: 14,
    color: "#4B5563",
    marginVertical: 4,
  },
  info: {
    fontSize: 12,
    color: "#6B7280",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    color: "#6C63FF",
  },
});