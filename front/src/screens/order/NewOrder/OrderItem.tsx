import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { navigate } from '../../../navigation/NavigationUtils';
import { Alert } from 'react-native';

interface OrderItemProps {
  orderId:string;
  name: string;
  status: 'pending' | 'goToCafe' | 'makingMenu' | 'goToClient' | 'delivered' | 'cancelled' | 'complete';
  createdAt: string;
  orderDetails: string;
  priceOffer: number;
  deliveryFee: number;
  orderType:string;
  imageUrl: any; // 로컬 이미지 경로를 받기 위해 any 타입 사용
  roomId:string;
}

const getStatusMessage = (status: string, createdAt: string) => {
  const date = new Date(createdAt);
  const formattedDate = `${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}시 ${date.getMinutes()}분`;

  switch (status) {
    case 'pending':
      return '주문 접수 완료';
    case 'accepted':
      return '배달 접수 완료';
    case "goToCafe": 
      return "카페로 이동중"
      case 'delivered':
        return `배달완료 (${formattedDate})`;
    case 'makingMenu':
      return '가게로 이동 중';
    case 'goToClient':
      return '고객에게 이동 중';
    case 'cancelled':
      return `주문 취소 (${formattedDate})`;
    default:
      return '수정';
  }
};

// 상태에 따른 글자색 반환
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return '#FFA500'; // 주황색 (진행 중)
    case 'accepted':
      return '#007AFF'; // 파란색 (배달 접수)
    case 'makingMenu':
      return '#4CAF50'; // 초록색 (가게로 이동 중)
    case 'goToClient':
      return '#FF6347'; // 토마토색 (고객에게 이동 중)
    case 'delivered':
      return '#888'; // 회색 (완료)
    case 'cancelled':
      return '#FF0000'; // 빨간색 (취소)
    default:
      return '#000'; // 기본 검정색
  }
};

const OrderItem: React.FC<OrderItemProps> = ({ orderId, name, status, createdAt, orderDetails, priceOffer, deliveryFee,orderType, imageUrl ,roomId}) => {
  const statusColor = getStatusColor(status); // 상태에 따른 색상 가져오기

  //주문상세
  const showOrderDetails = () => {
    console.log('d');
    navigate("OrderDetailScreen",{orderId,orderType});
    // 상세페이지 이동 타입에 맞게 조회!
    // navigate 파람스에 orderId, orderType 전달
    // 주문상세 페이지에서 파람스를 가지고 액션 실행 -> 데이터 받아서 조회


  }
 

  // 더미 함수들
  const handleChatPress = () => {
    //생성된 채팅방 or 여기서 생성할까?
    console.log('채팅 문의 버튼 클릭',{roomId});
    navigate('ChatRoom',{roomId});
  };

  const handleLocationPress = () => {
    //배달자의 위치 띄우기
    navigate("LiveMap", { orderId, status })
    
  };

  const handlerOrederCancel = () => {
    Alert.alert(
      '주문 취소 확인',
      '정말 주문을 취소하시겠습니까?',
      [
        {
          text: '아니오',
          style: 'cancel',
        },
        {
          text: '예',
          onPress: () => {
            navigate('CancelOrderScreen', { orderId, orderType });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleReviewPress = () => {
    
  };

  const handleReorderPress = () => {
    //주문 페이지로 이동
    navigate('OrderListScreen');
    console.log('재주문 버튼 클릭');
  };

  // 상태에 따라 버튼을 결정
  const renderActionButton = () => {
    switch (status) {
      case 'pending':
        return (
          <Button mode="outlined" style={styles.button} onPress={handlerOrederCancel}>
            주문 취소
          </Button>
        );
      case 'complete':
        return (
          <Button mode="outlined" style={styles.button} onPress={handleReviewPress}>
            리뷰 작성
          </Button>
        );
      case 'cancelled':
        return (
          <Button mode="outlined" style={styles.button} onPress={handleReorderPress}>
            재주문
          </Button>
        );
      default:
        return (
          <Button mode="outlined" style={styles.button} onPress={handleLocationPress}>
            위치 보기
          </Button>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.status, { color: statusColor }]}>{getStatusMessage(status, createdAt)}</Text>
        <TouchableOpacity>
          <Text style={styles.detailButton} onPress={showOrderDetails}>주문상세</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text>
        <Image source={imageUrl} style={styles.image} /> {/* 로컬 이미지 사용 */}
        </Text>
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.orderDetails} numberOfLines={2}>{orderDetails}</Text>
          <Text style={styles.price}>{`가격: ${priceOffer}원`} {`배달팁: ${deliveryFee}원`}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="outlined" style={styles.button} onPress={handleChatPress}>
          채팅 문의
        </Button>
        {renderActionButton()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailButton: {
    color: '#007AFF',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetails: {
    color: '#555',
    marginVertical: 4,
  },
  price: {
    fontSize: 14,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default OrderItem;