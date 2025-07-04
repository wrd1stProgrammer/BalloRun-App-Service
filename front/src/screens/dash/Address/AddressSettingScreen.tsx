import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../utils/OrderComponents/Header";
import { navigate } from "../../../navigation/NavigationUtils";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../redux/config/reduxHook";
import {
  selectUser,
  selectUserAddress,
  setUserAddress,
} from "../../../redux/reducers/userSlice";
import { appAxios } from "../../../redux/config/apiConfig";
import { refetchUser } from "../../../redux/actions/userAction";

interface Address {
  _id: string;
  address: string;
  detail: string;
  postalCode?: string;
  addressType?: string;
  riderNote?: string;
  lat?: number;
  lng?: number;
}

const AddressSettingScreen = () => {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(
    user?.address || null
  );
  const [addressList, setAddressList] = useState<Address[]>([]);

  useEffect(() => {
    if (!user?._id) return;

    const fetchAddresses = async () => {
      try {
        const response = await appAxios.get(`/address/list/${user._id}`);
        setAddressList(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      if (!user?._id) return;

      const fetchAddresses = async () => {
        try {
          const response = await appAxios.get(`/address/list/${user._id}`);
          setAddressList(response.data);
        } catch (error) {
          console.error("❌ Failed to fetch addresses:", error);
        }
      };

      fetchAddresses();
    }, [user])
  );

  const handleSelectAddress = async (item: Address) => {
    try {
      await appAxios.put(`/user/${user?._id}/update-address`, {
        address: item.address,
        lat: item.lat,
        lng: item.lng,
      });
      dispatch(
        setUserAddress({
          address: item.address,
          detail: item.detail,
          postalCode: item.postalCode,
          addressType: item.addressType,
          riderNote: item.riderNote,
          lat: item.lat,
          lng: item.lng,
        })
      );
      setSelectedAddress(item._id);
      await dispatch(refetchUser());
    } catch (error) {
      console.error("주소 업데이트 실패:", error);
      Alert.alert("오류", "주소를 설정하는 중 문제가 발생했습니다.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="주소 설정"
        showEdit={true}
        onEditPress={() => navigate("AddressEditScreen")}
      />
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            if (addressList.length >= 10) {
              Alert.alert("알림", "주소는 최대 10개까지만 등록할 수 있습니다.");
            } else {
              navigate("AddressSearchScreen");
            }
          }}
          style={styles.searchBar}
        >
          <Ionicons name="search" size={20} color="black" />
          <Text style={styles.buttonText}>지번, 도로명, 건물명으로 검색</Text>
        </TouchableOpacity>
        <Pressable
          style={styles.locationButton}
          onPress={() => {
            if (addressList.length >= 10) {
              Alert.alert("알림", "주소는 최대 10개까지만 등록할 수 있습니다.");
            } else {
              navigate("FindMap");
            }
          }}
        >
          <Ionicons name="locate" size={20} color="white" />
          <Text style={styles.locationButtonText}>현재 위치로 찾기</Text>
        </Pressable>

        {/* 안내 문구 (중앙, 작은 회색) */}

        <FlatList
          data={addressList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <Pressable
              style={styles.addressItem}
              onPress={() => handleSelectAddress(item)}
            >
              <View>
                <Text style={styles.addressName}>{item.address}</Text>
                <Text style={styles.addressDetails}>{item.detail}</Text>
              </View>
              {selectedAddress === item._id && (
                <Ionicons name="checkmark" size={20} color="blue" />
              )}
            </Pressable>
          )}
        />
        <Text style={styles.infoText}>
          주소 변경 시 '주변 러너'를 터치해 새로고침 해주세요
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  infoText: {
    fontSize: 12,
    color: "#888",
    textAlign: "center", // 중앙 정렬
    marginVertical: 1,
    marginBottom: 12, // 리스트와 거리 조금 띄우기
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 10, // add horizontal margin
  },
  locationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    marginBottom: 16,
    marginHorizontal: 10, // add horizontal margin
  },
  locationButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  addressItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginHorizontal: 5,
  },
  addressName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  addressDetails: {
    fontSize: 14,
    color: "#666",
  },
});

export default AddressSettingScreen;
