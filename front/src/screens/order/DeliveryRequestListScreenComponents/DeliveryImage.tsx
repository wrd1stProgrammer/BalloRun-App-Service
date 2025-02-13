import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { completeActionHandler } from "../../../redux/actions/riderAction";

interface OrderItem {
  _id: string;
  items: { cafeName: string; menuName: string }[];
  lat: string;
  lng: string;
  deliveryType: string;
  status: string;
  startTime: string;
  deliveryFee: number;
  createdAt: number;
  riderRequest: string;
  endTime: string;
  selectedFloor: null | string;
  updatedAt: string
}
type DeliveryImageRouteParams = {
  item: OrderItem;
};

const DeliveryImage = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ DeliveryImage: DeliveryImageRouteParams }, 'DeliveryImage'>>();
  const orderId = route.params.item._id // 데이터 받기
  
  const dispatch = useAppDispatch();

  const handleFilePick = async () => {
  };

  // 업로드 버튼 클릭 시 실행
  const handleSubmit = async() => {
    // if (!imageUri) {
    //   Alert.alert("사진 업로드 필요", "배달 완료 사진을 업로드해주세요!");
    //   return;
    // }

    const dummyRes = await dispatch(completeActionHandler(orderId));
    console.log(dummyRes)



    // 여기에 서버로 이미지 업로드하는 API 호출 추가 가능
    Alert.alert("업로드 완료", "배달 완료 사진이 업로드되었습니다.");
  };

  return (
    <View style={styles.container}>
      {/* 뒤로가기 버튼 */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>배달 완료 사진 업로드</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={handleFilePick}>
        <Text style={styles.uploadButtonText}>
          {imageUri ? "사진 변경하기" : "사진 업로드하기"}
        </Text>
      </TouchableOpacity>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>📌 사진 업로드 주의사항</Text>
        <Text style={styles.instructionText}>✔️ 상품이 잘 보이도록 촬영해주세요.</Text>
        <Text style={styles.instructionText}>✔️ 흐릿하거나 잘린 사진은 인정되지 않습니다.</Text>
        <Text style={styles.instructionText}>✔️ 주문자의 요청 사항을 준수해주세요.</Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, imageUri && { backgroundColor: "#ccc" }]}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>사진 제출하기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  uploadButton: {
    backgroundColor: "#8A67F8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  preview: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
  instructions: {
    marginTop: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    width: "100%",
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  instructionText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  submitButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeliveryImage;