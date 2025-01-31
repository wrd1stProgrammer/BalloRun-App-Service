import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView,Alert } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { useAppDispatch } from '../../../redux/config/reduxHook';
import { acceptActionHandler } from '../../../redux/actions/riderAction';

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: string;
  startTime: string;
  deliveryFee: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
};

type DeliveryBottomSheetProps = {
  deliveryItems: DeliveryItem[];
  loading: boolean;
};



function DeliveryBottomSheet({ deliveryItems, loading }: DeliveryBottomSheetProps): JSX.Element {
  const snapPoints = ['25%', '50%', '90%'];
  const dispatch = useAppDispatch();

  //주문 수락시 
const acceptHandler = async(orderId:string) => {
  console.log(orderId,'id logging');
  const dummyRes = await dispatch(acceptActionHandler(orderId));
  console.log(dummyRes);

}

  return (
    <BottomSheet snapPoints={snapPoints}>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#6610f2" />
        ) : (
          <ScrollView>
            {deliveryItems.map((item) => (
              <View key={item._id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cafeName}>{item.items[0]?.cafeName || '카페 이름'}</Text>
                </View>
                <Text style={styles.address}>{item.address || '배달 주소'}</Text>
                <View style={styles.cardBody}>
                  <Text style={styles.deliveryType}>{item.deliveryType || '배달 유형'}</Text>
                  <Text style={styles.time}>{new Date(item.endTime).toLocaleTimeString()} 만료 시간</Text>
                </View>
                <View style={styles.footer}>
                  <TouchableOpacity onPress={()=> acceptHandler(item._id)} style={styles.button}>
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
