import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { goBack, navigate } from '../../navigation/NavigationUtils';
import menuItems from '../../assets/cafeData/cafeMenuData';

const CafeMenuListScreen: React.FC = () => {
  // 더미 데이터

  const renderMenuItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.restaurant}>{item.restaurant}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => {console.log('add to cart')}}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 상단 바 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>나인틴 카페</Text>
        </TouchableOpacity>
    
          <TouchableOpacity style={styles.iconButton}>
                <Ionicons name ='search' size={25} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
                <Ionicons name ='settings' size={25} />
          </TouchableOpacity>
      </View>

      {/* 메뉴 리스트 */}
      <Text style={styles.sectionTitle}>인기있는 음료</Text>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
      />

      {/* 하단 버튼 */}
      <TouchableOpacity style={styles.cartButton} onPress={() => navigate('BasketScreen')}>
        <Text style={styles.cartButtonText}>장바구니에 추가하기</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CafeMenuListScreen;

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
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backButtonText: {
    fontSize: 18,
  },
  dropdown: {
    flex: 1,
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    marginLeft: 8,
  },
  iconText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  menuList: {
    paddingHorizontal: 16,
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
  restaurant: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 16,
    padding: 8,
  },
  addButtonText: {
    fontSize: 18,
    color: '#666',
  },
  cartButton: {
    backgroundColor: '#d0a6f3',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    margin: 16,
  },
  cartButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
