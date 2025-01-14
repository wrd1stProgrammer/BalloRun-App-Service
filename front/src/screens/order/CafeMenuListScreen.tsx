  import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { goBack, navigate } from "../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../../redux/config/reduxHook";
import { getCafeMenusBycafeName } from "../../redux/actions/menuAction";
import { selectMenu, setMenu } from "../../redux/reducers/menuSlice";
import { WebSocketContext } from "../../utils/Socket";

interface CafeMenuListScreenParams {
  cafeName: string; // CafeListScreen에서 넘어오는 카페 이름
}

const CafeMenuListScreen: React.FC = () => {
  const menu = useAppSelector(selectMenu);
  const socket = useContext(WebSocketContext);

  const route = useRoute<RouteProp<{ params: CafeMenuListScreenParams }>>();
  const { cafeName } = route.params;
  const dispatch = useAppDispatch();

  const [menuItems, setMenuItems] = useState<any[]>([]);  //서버에서 받아온 메뉴 데이터
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
  const handleSelectItem = (item: any) => {
    if (!item || typeof item.price !== "number") {
      console.error("Invalid item or missing price:", item);
      return;
    }
  
    dispatch((dispatch, getState) => {
      const currentMenu = getState().menu;
      const updatedItems = [...currentMenu.items];
  
      const foundIndex = updatedItems.findIndex(
        (selected) => selected._id === item._id
      );
  
      if (foundIndex !== -1) {
        // 이미 선택된 항목이라면 개수 증가
        updatedItems[foundIndex] = {
          ...updatedItems[foundIndex],
          quantity: (updatedItems[foundIndex].quantity || 1) + 1,
        };
      } else {
        // 새로 선택된 항목이라면 초기 개수를 1로 설정
        updatedItems.push({ ...item, quantity: 1 });
      }
  
      // 총 가격 계산
      const totalPrice = updatedItems.reduce(
        (sum, current) => sum + (current.price || 0) * (current.quantity || 1),
        0
      );
  
      // 총 개수 계산
      const totalQuantity = updatedItems.reduce(
        (sum, current) => sum + (current.quantity || 1),
        0
      );
  
 
  
      // Redux에 업데이트된 항목 전달
      dispatch(setMenu({ items: updatedItems, price: totalPrice, quantitiy: totalQuantity }));
    });
  };
  
  
  
  
  

  // 메뉴 렌더링
  const renderMenuItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imageUrl }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.menuName}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.price}>{item.price}원</Text>
      </View>
      <TouchableOpacity onPress={() => handleSelectItem(item)}>
        <Ionicons name="add-circle-outline" size={24} color="green" />
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
          <Text style={styles.dropdownText}>{cafeName}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search" size={25} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings" size={25} />
        </TouchableOpacity>
      </View>

      {/* 로딩 중 표시 */}
      {loading ? (
        <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
      ) : (
        <>
          {/* 메뉴 리스트 */}
          <Text style={styles.sectionTitle}>인기있는 음료</Text>

          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item._id} // _id 사용
            contentContainerStyle={styles.menuList}
          />
        </>
      )}

      {/* 장바구니 이동 버튼 */}
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => {
          navigate("BasketScreen")}}
      >
        <Text style={styles.cartButtonText}>
          장바구니로 이동 ({menu.quantitiy}개)
        </Text>
        <Text style={styles.cartButtonText}>{menu.price}원</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CafeMenuListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 2 },
    justifyContent: "space-between",
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
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 4,
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
