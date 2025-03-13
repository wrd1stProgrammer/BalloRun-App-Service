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
import Icon from "react-native-vector-icons/Ionicons"; // Ionicons 사용

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
      return "주문 접수 완료";
    case "goToCafe":
      return "카페로 이동 중";
    case "makingMenu":
      return "메뉴 준비 중";
    case "goToClient":
      return "배달 중";
    case "delivered":
      return "배달 완료";
    case "cancelled":
      return "주문 취소됨";
    default:
      return "진행 중";
  }
};

// name에 따라 Ionicons 아이콘 매핑 -> 이미지로 리펙토링 ㄱㄱ
const getIconName = (name: string) => {
  const lowerName = name.toLowerCase();
  if (
    lowerName.includes("편의점") ||
    lowerName.includes("gs") ||
    lowerName.includes("cu") ||
    lowerName.includes("세븐일레븐")
  ) {
    return "business-outline"; // 편의점 (건물 아이콘)
  } else if (
    lowerName.includes("마트") ||
    lowerName.includes("이마트") ||
    lowerName.includes("홈플러스")
  ) {
    return "cart-outline"; // 마트 (장바구니)
  } else if (
    lowerName.includes("카페") ||
    lowerName.includes("스타벅스") ||
    lowerName.includes("커피")
  ) {
    return "cafe-outline"; // 카페 (커피)
  } else if (
    lowerName.includes("음식") ||
    lowerName.includes("피자") ||
    lowerName.includes("치킨") ||
    lowerName.includes("버거")
  ) {
    return "restaurant-outline"; // 음식 (음식점)
  } else {
    return "cube-outline"; // 기타 (물품 상자)
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

  const checkChatRoom = async () => {
    const isChatRoom = await dispatch(checkChatRoomAction(roomId));
    return isChatRoom;
  };

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

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
  };

  const handleSubmitReview = async () => {
    try {
      await dispatch(rateStarsAction(orderId, rating));
      await dispatch(refetchUser());
      setLocalIsRated(true);
      Alert.alert("별점 등록 완료", `${rating}점이 등록되었습니다.`, [
        {
          text: "확인",
          onPress: () => {
            setReviewModalVisible(false);
            dispatch(getCompletedNewOrdersHandler());
          },
        },
      ]);
    } catch (error) {
      Alert.alert("오류", "별점 등록에 실패했습니다.");
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
        return (
          <TouchableOpacity
            style={[styles.actionButton, styles.buttonSpacing]}
            onPress={handlerOrderCancel}
          >
            <Text style={styles.actionButtonText}>주문 취소</Text>
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
            onPress={handlerOrderCancel}
          >
            <Text style={styles.actionButtonText}>주문 취소</Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.status}>{getStatusMessage(status)}</Text>
          <TouchableOpacity onPress={showOrderDetails}>
            <Text style={styles.detailButton}>주문 상세</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Icon
              name={getIconName(name)}
              size={50}
              color="#1A1A1A"
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

export default OrderItem;

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
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  actionButton: {
    flex: 1,
    backgroundColor: "#3366FF",
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
    color: "#555",
  },
  detailButton: {
    color: "#3366FF",
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
});