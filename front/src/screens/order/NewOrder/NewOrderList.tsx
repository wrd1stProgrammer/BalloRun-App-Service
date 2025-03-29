import React, { useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import OrderItem from './OrderItem';
import localImage from '../../../assets/cafeData/menuImage/image-2.png';
import { getOngoingNewOrdersHandler, getCompletedNewOrdersHandler } from '../../../redux/actions/orderAction';
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
    imageUrl: any;
    roomId: string;
    riderUsername: string;
    riderNickname: string;
    riderUserImage: string;
    isRated: boolean;
}

interface OrderListProps {
    activeTab: "orders" | "deliveries";
}

const NewOrderList: React.FC<OrderListProps> = ({ activeTab }) => {
  const dispatch = useAppDispatch();
  const socket = useContext(WebSocketContext);
  const [orders, setOrders] = useState<OrderItemProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (activeTab === "orders") {
      socket?.on("emitMatchTest", fetchOrders);
      fetchOrders();
    }

    return () => {
      fetchOrders();
      socket?.off("emitMatchTest");
    };
  }, [activeTab]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setIsRefreshing(false);
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const ongoingOrders = await dispatch(getOngoingNewOrdersHandler());
      const completedOrders = await dispatch(getCompletedNewOrdersHandler());
      const combinedOrders = [...ongoingOrders, ...completedOrders];
      console.log(combinedOrders);
      // 중복 제거 및 최신순 정렬
      const uniqueOrders: OrderItemProps[] = combinedOrders.filter(
        (order, index, self) => index === self.findIndex((o) => o._id === order._id)
      ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setOrders(uniqueOrders);
    } catch (error) {
      console.error('neworderlist 주문데이터 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  // Render no data state
  if (orders.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>주문 데이터가 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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
            imageUrl={localImage}
            orderType={item.orderType}
            roomId={item.roomId}
            username={item.riderUsername}
            nickname={item.riderNickname}
            userImage={item.riderUserImage}
            isRated={item.isRated}
          />
        )}
      contentContainerStyle={styles.listContainer}
      refreshing={isRefreshing}
      onRefresh={onRefresh}
    />
    </View>
  );
};

export default NewOrderList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#202632",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});