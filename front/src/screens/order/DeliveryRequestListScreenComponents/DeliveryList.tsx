import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal
} from "react-native";
import { formatDistanceToNow, format } from "date-fns";
import { id, ko } from "date-fns/locale";
import { useNavigation } from "@react-navigation/native"; // useNavigation 사용
import { useAppDispatch, useAppSelector } from "../../../redux/config/reduxHook";
import {
    getDeliveryListHandler,
} from "../../../redux/actions/orderAction";
import { WebSocketContext } from "../../../utils/sockets/Socket";
import { navigate } from "../../../navigation/NavigationUtils";
import {launchCamera, launchImageLibrary, CameraOptions, ImagePickerResponse, ImageLibraryOptions, Asset} from 'react-native-image-picker';
import ChangeStatusPicker from "./DeliveryListComponents.tsx/ChangeStatusPicker";
import { goToCafeHandler, goToClientHandler, makingMenuHandler } from "../../../redux/actions/riderAction";



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

interface OrderListProps {
    activeTab: "orders" | "deliveries";
  }

const DeliveryList: React.FC<OrderListProps> = ({activeTab}) => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null); //  선택된 주문 저장

  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const navigation = useNavigation(); // ✅ useNavigation 사용
  console.log(orders)
  const fetchOrders = async () => {
    try {
      const completedOrdersResponse = await dispatch(getDeliveryListHandler());
      const sortedOrders = completedOrdersResponse.sort(
        (a: OrderItem, b: OrderItem) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
      setOrders(sortedOrders);
      setAllOrders(sortedOrders);
    } catch (error) {
      console.error("주문 데이터 가져오기 실패:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab == "deliveries"){
        socket?.on("emitMatchTest", fetchOrders);
        fetchOrders();

            
         
    
        return () => {
          fetchOrders();
          socket?.off("emitMatchTest");
        };
    }
    else(console.log("나의 주문 목록 보기가 아님"))

  }, [navigation,socket,activeTab]);

  const handleFilter = (type: string | null) => {
    if (type) {
      setOrders(allOrders.filter((item) => item.status === type));
    } else {
      setOrders(allOrders);
    }
  };

  const handleFilter_1 = (type: string | null) => {
    if (type) {
      setOrders(allOrders.filter((item) => item.status !== type));
    } else {
      setOrders(allOrders);
    }
  };

  const handleTakePhoto = (item: OrderItem) => {
    // 사진 촬영 옵션 설정
    const options:CameraOptions= {
      mediaType: 'photo' as const, // 사진만 촬영
      cameraType : 'back',
      videoQuality : "high",
      saveToPhotos: true, // 갤러리에 저장
    };
  
    // 사진 촬영 실행
    launchCamera(options, (response:ImagePickerResponse) => {
      if (response.didCancel) {
        Alert.alert("사진 촬영이 취소되었습니다.");
      } else if (response.errorMessage) {
        Alert.alert("사진 촬영 중 오류가 발생했습니다.", response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri; // 촬영한 사진의 URI
        if (uri) {
          // 사진 URI와 item을 DeliveryImage로 전달
          navigate("DeliveryImage", { item, photoUri: uri });
        }
      }
    });
  };

    //사진앱을 실행하는 기능 화살표 함수
    const showPhoto = async (item:OrderItem)=> {
      const option: ImageLibraryOptions = {
          mediaType : "photo",
          selectionLimit : 1,
      }

      const response = await launchImageLibrary(option) //함수에 async가 붙어 있어야 함

      if(response.didCancel) Alert.alert('취소')
      else if(response.errorMessage) Alert.alert('Error : '+ response.errorMessage)
      else {
        const selectedPhoto = response.assets?.[0]; // 첫 번째 선택한 사진

        navigate("DeliveryImage", { item, photoUri: selectedPhoto?.uri });

      }
  }

  const ClickStatus = async (selectedStatus:String,orderId:string) => {
    console.log("Selected Status:", selectedStatus);
    if (selectedStatus === "goTocafe") {
      await dispatch(goToCafeHandler(orderId));
    } else if (selectedStatus === "goToClient") {
      await dispatch(goToClientHandler(orderId));
    } else if (selectedStatus === "makingMenu") {
      await dispatch(makingMenuHandler(orderId));
    }
  }


  const renderOrder = ({ item }: { item: OrderItem }) => (
    <>
  
    <View style={styles.card}>
      <View style={styles.rowHeader}>
        <Text style={styles.cafeName}>{item.items[0]?.cafeName}</Text>
        <TouchableOpacity>
          <Text style={styles.moreButton}>...</Text>
        </TouchableOpacity>
      </View>
      {item.deliveryType === "direct" ? (
        <Text style={styles.address}>{`${item.lat}, ${item.lng}`}</Text>
      ) : (
        <Text style={styles.address}>{item.selectedFloor}</Text>
      )}

      <Text
        style={
          item.status === "pending"
            ? styles.pendingStatus
            : item.status === "inProgress"
            ? styles.inProgressStatus
            : styles.completedStatus
        }
      >
        {item.status === "pending"
          ? "수락 대기 중"
          : item.status === "accepted"
          ? "배달중 accepted"
          : item.status === "delivered" 
          ? "배달중 delivered"
          : item.status === "goToCafe" 
          ? "카페로 이동중"
          : item.status === "goToClient" 
          ? "고객에게 이동중"
          : item.status === "makingMenu" 
          ? "제품 픽업 완료"
          : item.status === "complete" 
          ? "배달완료"
          : item.status === "cancelled" 
          ? "배달취소"
          :"수정"}
      </Text>


          




        {item.status !== "complete" && (
          <>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setSelectedOrder(item)} // ✅ 선택된 주문만 모달 열기
            >
              <Text style={styles.pendingStatus}>배달 상태 변경하기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={
                () => navigate("DeliveryImage", { item })}
            >
              <Text style={styles.buttonText}>배달 완료 사진 업로드하기</Text>
            </TouchableOpacity>
            </>)}
      <View style={styles.rowFooter}>
        <Text style={styles.deliveryType}>
          {item.deliveryType === "direct" ? "직접 배달" : "음료 보관함"}
        </Text>
        <Text style={styles.timeInfo}>{`${format(new Date(item.startTime), "HH:mm")}`}</Text>
        <Text style={styles.timeInfo}>{`${format(new Date(item.endTime), "HH:mm")}`}</Text>

      </View>
      <View style={styles.rowFooter}>

        <Text style={styles.deliveryFee}>{`${item.deliveryFee}원`}</Text>
        <Text style={styles.timeInfo}>주문수락시간:{`${formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: ko })}`}
        </Text>

        <Text style={styles.timeInfo}>{item.riderRequest}</Text>
        <Text style={styles.timeAgo}>
          {`${formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: ko })}`}
        </Text>
      </View>
    </View>
    </>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </SafeAreaView>
    );
  }

  return (
    <>
      <Modal
        visible={selectedOrder !== null} // ✅ 특정 주문이 선택되었을 때만 모달 표시
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ChangeStatusPicker
              onClose={() => setSelectedOrder(null)}
              onConfirm={(selectedStatus) => {
                if (selectedOrder) {
                  ClickStatus(selectedStatus, selectedOrder._id);
                  setSelectedOrder(null)
                }
              }}
            />
          </View>
        </View>
      </Modal>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleFilter_1("complete")}>
          <Text style={styles.buttonText}>배달중</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => handleFilter("complete")}>
          <Text style={styles.buttonText}>배달완료 & 배달취소</Text>
        </TouchableOpacity>
      </View>




      <FlatList
        data={orders}
        keyExtractor={(item, index) => item._id ? item._id : `key-${index}`} // ✅ _id가 없으면 index 사용
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
      />
    </>
  );
};



const styles =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 12,
    marginHorizontal: 10,
  },
  button: {
    backgroundColor: "#8A67F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: "#6200ee",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cafeName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  moreButton: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ccc",
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginVertical: 8,
  },
  pendingStatus: {
    fontSize: 14,
    color: "#ff9800",
    fontWeight: "bold",
  },
  inProgressStatus: {
    fontSize: 14,
    color: "#4caf50",
    fontWeight: "bold",
  },
  completedStatus: {
    fontSize: 14,
    color: "#6200ee",
    fontWeight: "bold",
  },
  rowFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  deliveryType: {
    fontSize: 14,
    color: "#333",
  },
  timeInfo: {
    fontSize: 14,
    color: "#666",
  },
  deliveryFee: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6200ee",
  },
  timeAgo: {
    fontSize: 12,
    color: "#999",
  },
  deliveryContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  deliveryText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#8A67F8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default DeliveryList;
