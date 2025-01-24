import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { getOrderData } from '../../../redux/actions/riderAction';
import { useAppDispatch } from '../../../redux/config/reduxHook';

type DeliveryItem = {
  _id: string;
  items: any[]; // 아이템 배열
  lat: string;
  lng: string;
  deliveryType: string;
  startTime: string;
  deliveryFee: number;
};

function DeliveryBottomSheet(): JSX.Element {
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 주문 데이터 가져오기
    const fetchOrders = async () => {
      setLoading(true);
      const orders = await dispatch(getOrderData()); // 서버에서 데이터 가져오기
      setDeliveryItems(orders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // BottomSheet snap points
  const snapPoints = ['25%', '50%', '90%'];

  const renderItem = ({ item }: { item: DeliveryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.items[0]?.menuName || '주문 아이템'} - {item.items.length}건</Text>
        <Text style={styles.subtitle}>{item.items[0]?.cafeName || '카페 이름'}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.type}>{item.deliveryType}</Text>
        <Text style={styles.time}>
          {new Date(item.startTime).toLocaleTimeString()} 주문
        </Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>수락하기</Text>
      </TouchableOpacity>
      <Text style={styles.price}>{item.deliveryFee.toLocaleString()}원</Text>
    </View>
  );

  return (
    <BottomSheet snapPoints={snapPoints}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#6610f2" />
        ) : (
          <FlatList
            data={deliveryItems}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  cardHeader: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  type: {
    fontSize: 14,
    color: '#495057',
  },
  time: {
    fontSize: 12,
    color: '#adb5bd',
  },
  button: {
    backgroundColor: '#6610f2',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'right',
    marginTop: 8,
  },
});

export default DeliveryBottomSheet;
