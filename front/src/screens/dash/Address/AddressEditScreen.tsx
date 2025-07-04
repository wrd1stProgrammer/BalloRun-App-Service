import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../utils/OrderComponents/Header";
import { navigate } from "../../../navigation/NavigationUtils";
import { useAppSelector } from "../../../redux/config/reduxHook";
import { selectUser } from "../../../redux/reducers/userSlice";
import { appAxios } from "../../../redux/config/apiConfig";

interface Address {
  _id: string;
  address: string;
  detail: string;
}

const AddressEditScreen = () => {
  const user = useAppSelector(selectUser);
  const [addressList, setAddressList] = useState<Address[]>([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAddresses = async () => {
      try {
        const response = await appAxios.get(`/address/list/${user._id}`);
        setAddressList(response.data);
      } catch (error) {
        console.error("❌ 주소 목록 가져오기 실패:", error);
      }
    };

    fetchAddresses();
  }, [user]);

  const handleEditAddress = (address: Address) => {
    navigate("AddressEditDetailScreen", {
      addressId: address._id,
      address: address.address,
      detail: address.detail,
    });
  };

  const handleDeleteAddress = async (addressId: string) => {
    Alert.alert("삭제 확인", "이 주소를 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          try {
            await appAxios.delete(`/address/${addressId}`);
            setAddressList((prev) =>
              prev.filter((addr) => addr._id !== addressId)
            );
          } catch (error) {
            console.error("❌ 주소 삭제 실패:", error);
            Alert.alert("오류", "주소 삭제 중 문제가 발생했습니다.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="주소 편집" />
      <View style={styles.container}>
        <FlatList
          data={addressList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.addressItem}>
              <View>
                <Text style={styles.addressName}>{item.address}</Text>
                <Text style={styles.addressDetails}>{item.detail}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <Pressable
                  style={styles.editButton}
                  onPress={() => handleEditAddress(item)}
                >
                  <Text style={styles.buttonText}>수정</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => handleDeleteAddress(item._id)}
                >
                  <Text style={styles.buttonText}>삭제</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
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
  addressItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginHorizontal: 10,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressDetails: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AddressEditScreen;
