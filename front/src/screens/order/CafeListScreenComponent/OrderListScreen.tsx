import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { navigate } from '../../../navigation/NavigationUtils';

interface Category {
  name: string;
  icon: string;
  screen: string;
}

const categories: Category[] = [
  { name: '커피', icon: 'cafe', screen: 'CafeListScreen' },
  { name: '편의점', icon: 'storefront', screen: 'OrderPageScreen' },
  { name: '약', icon: 'medical', screen: 'OrderPageScreen' },
  { name: '음식', icon: 'fast-food', screen: 'OrderPageScreen' },
  { name: '물건', icon: 'cart', screen: 'OrderPageScreen' },
  { name: '기타', icon: 'ellipsis-horizontal', screen: 'OrderPageScreen' },
];

const OrderListScreen: React.FC = () => {
  const handleCategoryPress = (screen: string, name: string) => {
    // 네비게이션 유틸리티를 통해 화면 전환
    navigate(screen, { name });
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {categories.map((cat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
            onPress={() => handleCategoryPress(cat.screen, cat.name)}
          >
            <Ionicons name={cat.icon as any} size={40} color="#4A90E2" />
            <Text style={styles.categoryText}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  gridContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  categoryText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default OrderListScreen;