import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import OrderItem from './OrderItem'; // OrderItem 컴포넌트 경로
import localImage from '../../../assets/cafeData/menuImage/image-2.png'; // 로컬 이미지 경로
import { getOngoingNewOrdersHandler,getCompletedNewOrdersHandler } from '../../../redux/actions/orderAction';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { WebSocketContext } from '../../../utils/sockets/Socket';

interface OrderItemProps {
    _id: string;
    name: string;
    status: 'pending' | 'goToCafe' | 'makingMenu' | 'goToClient' | 'delivered';
    createdAt: string;
    orderDetails: string;
    priceOffer: number;
    deliveryFee: number;
    orderType: string;
    imageUrl: any; // 로컬 이미지 경로를 받기 위해 any 타입 사용
    roomId:string;
  }

interface OrderListProps {
    activeTab: "orders" | "deliveries";
  }

const NewOrderList:React.FC<OrderListProps> = ({activeTab}) => {
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  
  const [orders, setOrders] = useState<OrderItemProps[]>([]);

  useEffect(() => {
    if(activeTab === "orders"){
        socket?.on("emitMatchTest", fetchOrders);
        fetchOrders();
    }

    return () => {
      fetchOrders();
      socket?.off("emitMatchTest");
    };
  },[activeTab]);

  const fetchOrders = async () => {
    try {
      // 진행 중인 주문 데이터 가져오기
      const ongoingOrders = await dispatch(getOngoingNewOrdersHandler());  
      // 완료된 주문 데이터 가져오기
      const completedOrders = await dispatch(getCompletedNewOrdersHandler());  
      // 두 배열 합
      const combinedOrders = [...ongoingOrders, ...completedOrders];

      // 중복 제거
      const uniqueOrders: OrderItemProps[] = combinedOrders.filter(
        (order, index, self) =>
          index === self.findIndex((o) => o._id === order._id)
      );
      // 최신순으로 정렬 (createdAt 기준)
      uniqueOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());  
      // 상태 업데이트
      setOrders(uniqueOrders);
    } catch (error) {
      console.error('주문 데이터 불러오기 실패:', error);
    }
  };


  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => item._id || `order-${index}`}
        renderItem={({ item }) => (
          <OrderItem
            orderId={item._id}
            name={item.name}
            status={item.status}
            createdAt={item.createdAt}
            orderDetails={item.orderDetails}
            priceOffer={item.priceOffer}
            deliveryFee={item.deliveryFee}
            imageUrl={localImage} // 로컬 이미지 사용
            orderType={item.orderType}
            roomId={item.roomId}
          />
        )}
      />
    </View>
  );
};

export default NewOrderList;