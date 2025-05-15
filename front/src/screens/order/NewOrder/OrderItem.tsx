import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { navigate, resetAndNavigate } from "../../../navigation/NavigationUtils";
import { useAppDispatch } from "../../../redux/config/reduxHook";
import { checkChatRoomAction } from "../../../redux/actions/chatAction";
import { rateStarsAction, getCompletedNewOrdersHandler } from "../../../redux/actions/orderAction";
import { refetchUser } from "../../../redux/actions/userAction";
import Icon from "react-native-vector-icons/Ionicons";
import { Image } from "react-native";

interface OrderItemProps {
  orderId: string;
  name: string;
  status: "pending" | "goToCafe" | "makingMenu" | "goToClient" | "delivered" | "cancelled" | "complete";
  createdAt: string;
  orderDetails: string;
  priceOffer: number;
  deliveryFee: number;
  orderType: string;
  roomId: string;
  username: string;
  nickname: string;
  userImage: string;
  isRated: boolean;
}

const getStatusMessage = (status: string) => {
  switch (status) {
    case "pending":
      return { text: "주문 접수 완료", color: "#3384FF" };
    case "goToCafe":
      return { text: "카페로 이동 중", color: "#3384FF" };
    case "makingMenu":
      return { text: "메뉴 준비 중", color: "#3384FF" };
    case "goToClient":
      return { text: "배달 중", color: "#3384FF" };
    case "delivered":
      return { text: "배달 완료", color: "#202632" };
    case "cancelled":
      return { text: "주문 취소됨", color: "#FF3B30" };
    default:
      return { text: "진행 중", color: "#3384FF" };
  }
};

const getIconSource = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes("편의점") || lower.includes("gs") || lower.includes("cu")) {
    return require("../../../assets/Icon/cs64.png");
  } else if (lower.includes("물품") || lower.includes("이마트")) {
    return require("../../../assets/Icon/product64.png");
  } else if (lower.includes("카페") || lower.includes("커피")) {
    return require("../../../assets/Icon//cafe64.png");
  } else if (lower.includes("음식") || lower.includes("버거")) {
    return require("../../../assets/Icon/food64.png");
  } else {
    return require("../../../assets/Icon/etc64.png");
  }
};

const OrderItem: React.FC<OrderItemProps> = ({
  orderId,
  name,
  status,
  createdAt,
  orderDetails,
  priceOffer,
  deliveryFee,
  orderType,
  roomId,
  username,
  nickname,
  userImage,
  isRated,
}) => {
  const dispatch = useAppDispatch();
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [localIsRated, setLocalIsRated] = useState(isRated);

  const statusInfo = getStatusMessage(status);

  const checkChatRoom = async () => {
    const isChatRoom = await dispatch(checkChatRoomAction(roomId));
    return isChatRoom;
  };
 // 대소문자.
  const showOrderDetails = () => {
    navigate("OrderDetailScreen", { orderId, orderType });
  };

  const handleChatPress = async () => {
    const chatRoomExists = await checkChatRoom();
    if (chatRoomExists === 1) {
      navigate("ChatRoom", { roomId, username, nickname, userImage });
    } else {
      Alert.alert("알림", "존재하지 않는 채팅방입니다.", [{ text: "확인", style: "cancel" }], {
        cancelable: true,
      });
    }
  };

  const handlerOrderCancel = () => {
    Alert.alert(
      "주문 취소 확인",
      "정말 주문을 취소하시겠습니까?",
      [
        { text: "아니오", style: "cancel" },
        { text: "예", onPress: () => navigate("CancelOrderScreen", { orderId, orderType }) },
      ],
      { cancelable: false }
    );
  };

  const handleReorderPress = () => {
    navigate("OrderPageScreen", { name });
  };

  const handleReviewPress = () => {
    if (!localIsRated) {
      setReviewModalVisible(true);
    }
  };

  const handleLocationPress = () => {
    // navigate("LiveMap", { orderId, status });
    Alert.alert("알림", "업데이트 예정입니다.");
  };


  

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert("알림", "별점을 선택해주세요.");
      return;
    }

    try {
      setReviewModalVisible(false); // Close modal immediately
      await dispatch(rateStarsAction(orderId, rating));
      await dispatch(refetchUser());
      setLocalIsRated(true);
      Alert.alert("별점 등록 완료", `${rating}점이 등록되었습니다.`, [
        {
          text: "확인",
          onPress: () => {
            dispatch(getCompletedNewOrdersHandler());
          },
        },
      ]);
    } catch (error) {
      Alert.alert("오류", "별점 등록에 실패했습니다.");
      setReviewModalVisible(true); // Reopen modal if error occurs
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <Text style={styles.star}>{i <= rating ? "★" : "☆"}</Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  const renderActionButton = () => {
    switch (status) {
      case "pending":
      case "goToCafe":
      case "makingMenu":
      case "goToClient":
      case "complete": 
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.buttonSpacing]}
            onPress={handleLocationPress}
          >
            <Text style={styles.actionButtonText}>위치 보기</Text>
          </TouchableOpacity>
        );
      case "delivered":
        return (
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.buttonSpacing,
              localIsRated ? styles.disabledButton : null,
            ]}
            onPress={handleReviewPress}
            disabled={localIsRated}
          >
            <Text
              style={[styles.actionButtonText, localIsRated ? styles.disabledButtonText : null]}
            >
              {localIsRated ? "평가 완료" : "별점 평가"}
            </Text>
          </TouchableOpacity>
        );
      case "cancelled":
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.buttonSpacing]}
            onPress={handleReorderPress}
          >
            <Text style={styles.actionButtonText}>재주문</Text>
          </TouchableOpacity>
        );
      default:
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.buttonSpacing]}
            onPress={handleLocationPress}
          >
            <Text style={styles.actionButtonText}>위치 보기</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.status, { color: statusInfo.color }]}>{statusInfo.text}</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={showOrderDetails}>
              <Text style={styles.detailsButton}>주문 상세</Text>
            </TouchableOpacity>
            {status !== "cancelled" && status !== "delivered" && (
              <TouchableOpacity onPress={handlerOrderCancel}>
                <Text style={styles.cancelButton}>주문 취소</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.content}>
        <View style={styles.iconContainer}>
  <Image
    source={getIconSource(name)}
    style={styles.iconImage}
    resizeMode="contain"
  />
</View>
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.orderDetails}>{orderDetails}</Text>
            <Text style={styles.price}>가격: {priceOffer}원 | 배달팁: {deliveryFee}원</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.chatButton, styles.buttonSpacing]} onPress={handleChatPress}>
            <Text style={styles.chatButtonText}>채팅 문의</Text>
          </TouchableOpacity>
          {renderActionButton()}
        </View>
      </View>

      <Modal
        visible={isReviewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReviewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
              <Text style={styles.closeButton}>X</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmitReview}>
              <Text style={styles.submitButton}>완료</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.starContainer}>
            {renderStars()}
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  buttonSpacing: {
    marginHorizontal: 5,
  },
  chatButton: {
    flex: 1,
    backgroundColor: "#EEE",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chatButtonText: {
    color: "#202632",
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#3384FF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  disabledButtonText: {
    color: "#FFFFFF",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailButton: {
    color: "#3366FF",
    fontWeight: "bold",
    marginRight: 10,
  },
  detailsButton: {
    color: "#202632",
    fontWeight: "bold",
    marginRight: 10,
  },
  cancelButton: {
    color: "#202632",
    fontWeight: "bold",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#F7F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  orderDetails: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalHeader: {
    position: "absolute",
    top: 40,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  closeButton: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  submitButton: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  star: {
    fontSize: 50,
    color: "#FFD700",
    marginHorizontal: 8,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  iconImage: {
    width: 50,
    height: 50,
  },
});

export default OrderItem;