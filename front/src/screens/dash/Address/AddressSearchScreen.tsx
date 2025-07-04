import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../utils/OrderComponents/Header";
import useGooglePlaces, { getPlaceDetails } from "./useGooglePlaces";
import { navigate } from "../../../navigation/NavigationUtils";

const AddressSearchScreen = () => {
  const [query, setQuery] = useState("");
  const { predictions, fetchPlaces } = useGooglePlaces();

  const handleAddressSelect = async (item: any) => {
    const placeDetails = await getPlaceDetails(item.place_id);
    if (placeDetails) {
      navigate("AddressDetailScreen", {
        selectedAddress: item.description,
        lat: placeDetails.lat,
        lng: placeDetails.lng,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="주소 검색" />
      <View style={styles.container}>
        <Text style={styles.title}>배달 받을 주소를 검색해주세요</Text>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="지번, 도로명, 건물명으로 검색"
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              fetchPlaces(text);
            }}
          />
        </View>

        <FlatList
          data={predictions}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.resultItem}
              onPress={() => handleAddressSelect(item)}
            >
              <Text style={styles.resultText}>{item.description}</Text>
            </Pressable>
          )}
        />

        <Pressable
          style={styles.locationButton}
          onPress={() => navigate("FindMap")}
        >
          <Ionicons name="locate" size={20} color="white" />
          <Text style={styles.locationButtonText}>현재 위치로 찾기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    paddingHorizontal: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "black",
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  resultText: {
    fontSize: 14,
    color: "#333",
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginTop: 16,
    marginHorizontal: 10,
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default AddressSearchScreen;
