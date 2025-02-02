// HomeScreen.tsx

import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/config/reduxHook';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { navigate } from '../../navigation/NavigationUtils';
import { selectUser } from '../../redux/reducers/userSlice';


const HomeScreen: React.FC = () => {
  const user = useAppSelector(selectUser);


  return (
    <View style={styles.container}>
      {/* 상단 프로필/인사 문구 영역 */}
      <View style={styles.headerContainer}>
        <View style={styles.greetingContainer}>
          <Text style={styles.userName}>
            {user?.username}님, 안녕하세요!!!
          </Text>
          <Text>
          캠퍼스 커피에서 편함을 주문해보세요.
          </Text>
        </View>
        {/* 프로필 아이콘 (예: 실제 이미지 대체) */}
        <TouchableOpacity style={styles.profileIconWrapper} >
          <Ionicons name="person-circle" size={36} color="#999" />
        </TouchableOpacity>
      </View>

      {/* 메인 콘텐츠: 2개의 카드 */}
      <View style={styles.cardList}>
        {/* 배달하기 카드 */}
        <TouchableOpacity style={[styles.card, styles.deliveryCard]} onPress = {() => navigate('SelectDelivery')} >
          <Ionicons name="bicycle" size={28} color="#fff" />
          <Text style={styles.cardTextWhite}>배달하기</Text>
        </TouchableOpacity>

        {/* 주문하기 카드 */}
        <TouchableOpacity style={[styles.card, styles.orderCard]} onPress = {() => navigate('CafeListScreen')}>
          <Ionicons name="restaurant" size={28} color="#8A67F8" />
          <Text style={styles.cardTextDark}>주문하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF', 
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  // 상단 프로필 + 인사 영역
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 50,
  },
  greetingContainer: {
    flex: 1,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#666',
  },
  profileIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 카드 영역
  cardList: {
    // 배치(간격 등) 조절


  },
  card: {
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    // 그림자 (iOS/Android)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 3,
    // 가로축 내용 정렬
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 배달 카드(보라색 배경)
  deliveryCard: {
    backgroundColor: '#8A67F8',
    // 그림자 색 조금 진하게
    shadowColor: '#8A67F8',
    justifyContent: 'center',

  },
  orderCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#8A67F8',
    justifyContent: 'center',

  },
  cardTextWhite: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  cardTextDark: {
    color: '#8A67F8',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
  },
});
