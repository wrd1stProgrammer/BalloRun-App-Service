import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator // 로딩 스피너 추가
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../../redux/config/reduxHook";
import { completeActionHandler } from "../../../redux/actions/riderAction";
import {launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import { navigate, resetAndNavigate } from "../../../navigation/NavigationUtils";
import { uploadFile } from "../../../redux/actions/fileAction";
import { getChatRoomIdAndUploadImage, getDeliveryListHandler } from "../../../redux/actions/orderAction";
import { setWatchId } from "../../../redux/reducers/locationSlice";
import Geolocation from 'react-native-geolocation-service';

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
  photoUri:String;
};

const DeliveryImage = () => {
  const [selectedImage, setSelectedImage] = useState<{ 
    uri: string; 
    type: string;
    fileName?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ DeliveryImage: DeliveryImageRouteParams }, 'DeliveryImage'>>();
  const { item, photoUri } = route.params; // item과 photoUri 추출
  const orderId = route.params.item._id // 데이터 받기
  
  const dispatch = useAppDispatch();


  const watchId = useAppSelector((state) => state.location.watchId);



  const handleTakePhoto = (item: OrderItem) => {
    const options:CameraOptions= {
      mediaType: 'photo' as const,
      cameraType : 'back',
      videoQuality : "high",
      saveToPhotos: true,
    };
  
    launchCamera(options, (response:ImagePickerResponse) => {
      if (response.didCancel) {
        Alert.alert("사진 촬영이 취소되었습니다.");
      } else if (response.errorMessage) {
        Alert.alert("사진 촬영 중 오류가 발생했습니다.", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const { uri, type, fileName } = response.assets[0];
        setSelectedImage({ uri: uri!, type: type!, fileName });
      }
    });
  };
  
  const showPhoto = async (item:OrderItem)=> {
    const option: ImageLibraryOptions = {
        mediaType : "photo",
        selectionLimit : 1,
        includeBase64:true,
    }

    const response:ImagePickerResponse = await launchImageLibrary(option)

    if(response.didCancel) Alert.alert('취소')
    else if(response.errorMessage) Alert.alert('Error : '+ response.errorMessage)
    else {
      const { uri, type, fileName } = response.assets[0];
      setSelectedImage({ uri: uri!, type: type!, fileName });
    }
  }

const handleSubmit = async () => {
  setIsLoading(true);

  try {
    const imageResponse = await dispatch(uploadFile(selectedImage?.uri, "order_image"));
    console.log("받은 이미지리스폰스", imageResponse);

    const roomId = await dispatch(getChatRoomIdAndUploadImage(orderId));
    resetAndNavigate("ChatRoom", { roomId });

    const orders = await dispatch(getDeliveryListHandler());
    const activeOrders = orders.filter((order) =>
      ["accepted", "delivered", "goToCafe", "goToClient", "makingMenu"].includes(order.status)
    );
    console.log("DeliveryImages.tsx파일임")

    console.log(watchId)
    if (activeOrders.length === 0 && watchId !== null) {
      console.log("🚨 배달 중인 주문 없음 -> 위치 추적 종료", watchId);
      Geolocation.clearWatch(watchId);
      dispatch(setWatchId(null)); // Redux에서 watchId 삭제
      console.log("✅ 위치 추적 중지됨");
    }
  } catch (error) {
    console.error("업로드 실패:", error);
    Alert.alert("업로드 실패", "사진 업로드 중 오류가 발생했습니다.");
  } finally {
    setIsLoading(false);
  }
};

  const handleUploadPress = () => {
    Alert.alert(
      "사진 업로드",
      "사진을 어떻게 업로드하시겠습니까?",
      [
        {
          text: "카메라 촬영",
          onPress: () => handleTakePhoto(item),
        },
        {
          text: "갤러리에서 선택",
          onPress: () => showPhoto(item),
        },
        {
          text: "취소",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>배달 완료 사진 업로드</Text>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
        <Text style={styles.uploadButtonText}>
          {selectedImage?.uri ? "사진 변경하기" : "사진 업로드하기"}
        </Text>
      </TouchableOpacity>

      {selectedImage?.uri && <Image source={{ uri: selectedImage?.uri }} style={styles.preview} />}

      <View style={styles.instructions}>
        <Text style={styles.instructionTitle}>📌 사진 업로드 주의사항 </Text>
        <Text style={styles.instructionText}>✔️ 상품이 잘 보이도록 촬영해주세요.</Text>
        <Text style={styles.instructionText}>✔️ 흐릿하거나 잘린 사진은 인정되지 않습니다.</Text>
        <Text style={styles.instructionText}>✔️ 주문자의 요청 사항을 준수해주세요.</Text>
      </View>

      <TouchableOpacity
        style={[styles.submitButton, selectedImage?.uri && { backgroundColor: "#ccc" }]}
        onPress={handleSubmit}
        disabled={isLoading} // 로딩 중 버튼 비활성화
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" /> // 로딩 스피너 표시
        ) : (
          <Text style={styles.submitButtonText}>사진 제출하기</Text>
        )}
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
    justifyContent: "center", // 로딩 스피너 중앙 정렬
    alignItems: "center", // 로딩 스피너 중앙 정렬
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeliveryImage;