import { Image, TouchableOpacity, StyleSheet, Text, View, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { goBack, navigate } from '../../navigation/NavigationUtils';
import { useRoute, RouteProp } from '@react-navigation/native';

interface MenuItem {
  id: string;
  name: string;
  restaurant: string;
  price: number | string; // 원래 문자열일 수도 있으니 상황에 맞게
  image: any; 
}

interface BasketScreenParams {
  selectedItems: MenuItem[];
}

const BasketScreen: React.FC = () => {
  const route = useRoute<RouteProp<{ params: BasketScreenParams }>>();
  const { selectedItems } = route.params;

  // 각 item.id별 수량 관리
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // 장바구니로 넘어온 selectedItems가 있을 경우,
    // 각 아이템의 기본 수량을 1로 초기화
    const initialQuantities: { [key: string]: number } = {};
    selectedItems.forEach((item) => {
      initialQuantities[item.id] = 1;
    });
    setQuantities(initialQuantities);
  }, [selectedItems]);

  // 수량 증가
  const increaseQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  // 수량 감소
  const decreaseQuantity = (id: string) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max((prev[id] || 1) - 1, 1),
    }));
  };

  // 총 금액 계산
  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => {
      const quantity = quantities[item.id] || 1;

      // price가 문자열이라면 숫자로 변환
      let priceNumber = 0;
      if (typeof item.price === 'string') {
        // 예: '3000원' 이면 '3000' 부분만 추출
        priceNumber = parseInt(item.price.replace(/\D/g, ''), 10);
      } else {
        priceNumber = item.price;
      }
      return total + priceNumber * quantity;
    }, 0);
  };

  // 장바구니 목록 렌더
  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.price}>
          가격: 
          {typeof item.price === 'string'
            ? item.price
            : `${item.price.toLocaleString()}원`}
        </Text>
        {/* 수량 조절 */}
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => decreaseQuantity(item.id)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantities[item.id] || 1}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => increaseQuantity(item.id)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>장바구니</Text>
      </View>

      {/* 장바구니에 담긴 메뉴 리스트 */}
      <FlatList
        data={selectedItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
      />

      {/* 하단 총 금액 및 버튼 */}
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>
          총 금액: {calculateTotal().toLocaleString()}원
        </Text>
        <TouchableOpacity
          style={styles.orderButton}
          onPress={() => navigate('OrderWriteLoacation')}
        >
          <Text style={styles.orderButtonText}>
            {calculateTotal().toLocaleString()}원 배달 주문하기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BasketScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuList: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    padding: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  orderButton: {
    backgroundColor: '#d0a6f3',
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
  },
  orderButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
