import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

type DeliveryItem = {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  time: string;
  price: string;
};

function DeliveryBottomSheet(): JSX.Element {
  // Dummy data for the delivery items
  const deliveryItems: DeliveryItem[] = [
    {
      id: '1',
      title: '전남대학교 공과대학 7호관 3층 301호',
      subtitle: '공대 7호관 · 1잔',
      type: '직접 배달',
      time: '25분 전',
      price: '1,000원',
    },
    {
      id: '2',
      title: '전남대학교 AI융합대학 2층 205호',
      subtitle: '공대 7호관 · 1잔',
      type: '음료보관대',
      time: '25분 전',
      price: '500원',
    },
  ];

  // BottomSheet snap points
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const renderItem = ({ item }: { item: DeliveryItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.type}>{item.type}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>수락하기</Text>
      </TouchableOpacity>
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

  return (
    <BottomSheet snapPoints={snapPoints}>
      <View style={styles.container}>
        <FlatList
          data={deliveryItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
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
