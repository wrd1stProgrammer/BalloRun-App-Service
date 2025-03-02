import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { goBack, navigate } from "../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../redux/config/reduxHook";
import { getCafeMenusBycafeName } from "../../redux/actions/menuAction";
import { selectMenu, setMenu } from "../../redux/reducers/menuSlice";
import { WebSocketContext } from "../../utils/sockets/Socket";
import Header from "../../utils/OrderComponents/Header";

interface CafeMenuListScreenParams {
  cafeName: string; // CafeListScreen에서 넘어오는 카페 이름
}

const CafeMenuListScreen: React.FC = () => {
  const menu = useAppSelector(selectMenu);
  const socket = useContext(WebSocketContext);

  const route = useRoute<RouteProp<{ params: CafeMenuListScreenParams }>>();
  const { cafeName } = route.params;
  const dispatch = useAppDispatch();

  const [menuItems, setMenuItems] = useState<any[]>([]); //서버에서 받아온 메뉴 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  //const [selectedItems, setSelectedItems] = useState<any[]>([]); // 장바구니 선택 항목

  // 서버에서 메뉴 데이터를 가져오는 함수
  const fetchMenuItems = async () => {
    try {
      const menus = await dispatch(getCafeMenusBycafeName(cafeName));
      setMenuItems(menus); // 데이터 설정
    } catch (error) {
      console.error("메뉴 데이터를 가져오는 중 에러 발생:", error);
    } finally {
      setLoading(false); // 로딩 상태 종료
    }
  };

  // 화면이 로드될 때 데이터를 가져옴
  useEffect(() => {
    fetchMenuItems();
  }, []);

  // 메뉴 아이템 클릭 시 선택 상태에 추가


  // 메뉴 렌더링
  const renderMenuItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigate("CafeMenuOption", { menuItem: item })}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.menuName}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{item.price}원</Text>
      </View>
    </TouchableOpacity>
  );
  


  return (
        <SafeAreaView style={styles.container}>
    
    <View style={styles.container}>
      {/* 상단 바 */}
      <Header title={cafeName} showCart={false}  />


      {/* 로딩 중 표시 */}
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
      ) : (
        <>
          <View style={styles.container_1}>
              <TextInput
                style={styles.searchInput}
                placeholder="카페 이름 검색..."
                value={"메뉴 이름 입력"}
                onChangeText={(text) => (text)}
              />
                      
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item._id} // _id 사용
            contentContainerStyle={styles.menuList}
            numColumns={2}
          />
          </View>
        </>
      )}

      {/* 장바구니 이동 버튼 */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => {
          if (menu.items && menu.items.length > 0) {
            navigate("BasketScreen");
          } else {
            Alert.alert(
              "장바구니가 비어 있습니다",
              "상품을 추가한 후 장바구니로 이동할 수 있습니다.",
              [{ text: "확인", onPress: () => console.log("Alert 닫기") }]
            );
          }
        }}
      >
        <Text style={styles.cartButtonText}>
          장바구니로 이동 ({menu.quantitiy}개)
        </Text>
        <Text style={styles.cartButtonText}>{menu.price}원</Text>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};

export default CafeMenuListScreen;

const styles = StyleSheet.create({
  searchInput: {
    height: 48,
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginVertical: 12,
    backgroundColor: "#ffffff",
    fontSize: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container_1: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dropdown: {
    flex: 1,
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconButton: {
    marginLeft: 8,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginVertical: 16,
  },
  menuList: {
    paddingHorizontal: 8, // 좌우 여백
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 12, // 카드 간 간격
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    width: "48%", // 2열로 배열
    marginHorizontal: 4, // 카드 간 좌우 간격
    alignItems: "center", // 카드 내부 중앙 정렬
  },
  image: {
    width: "100%", // 이미지가 카드 너비를 채우도록
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
  },
  info: {
    alignItems: "center", // 텍스트 중앙 정렬
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
    textAlign: "center",
  },
  cartButton: {
    backgroundColor: "#d0a6f3",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    margin: 16,
  },
  cartButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});
