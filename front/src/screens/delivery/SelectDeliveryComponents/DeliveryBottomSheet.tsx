import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { getOrderData } from '../../../redux/actions/riderAction';
import { useAppDispatch } from '../../../redux/config/reduxHook';

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string; // 배달 주소
  deliveryType: string; // 배달 유형
  startTime: string; // 주문 시작 시간
  deliveryFee: number; // 배달비
  cafeLogo: string; // 카페 로고 URL
};

function DeliveryBottomSheet(): JSX.Element {
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const orders = await dispatch(getOrderData());
      setDeliveryItems(orders);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const snapPoints = ['25%', '50%', '90%'];

  return (
    <BottomSheet snapPoints={snapPoints}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#6610f2" />
        ) : (
          <ScrollView>
            {deliveryItems.map((item) => (
              <View key={item._id} style={styles.card}>
                {/* 카페 로고와 이름 */}
                <View style={styles.cardHeader}>
                  <Text style={styles.cafeName}>{item.items[0]?.cafeName || '카페 이름'}</Text>
                </View>

                {/* 배달 정보 */}
                <Text style={styles.address}>{item.address || '배달 주소'}</Text>
                <View style={styles.cardBody}>
                  <Text style={styles.deliveryType}>{item.deliveryType || '배달 유형'}</Text>
                  <Text style={styles.time}>{new Date(item.startTime).toLocaleTimeString()} 주문</Text>
                </View>

                {/* 수락하기 버튼 및 배달비 */}
                <View style={styles.footer}>
                  <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>수락하기</Text>
                  </TouchableOpacity>
                  <Text style={styles.price}>{item.deliveryFee.toLocaleString()}원</Text>
                </View>
              </View>
            ))}
          </ScrollView>
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cafeLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cafeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
  },
  address: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  cardBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  deliveryType: {
    fontSize: 14,
    color: '#495057',
  },
  time: {
    fontSize: 12,
    color: '#adb5bd',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6610f2',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
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
  },
});

export default DeliveryBottomSheet;
