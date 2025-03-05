import React, { useState } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView, Alert, ScrollView } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { goBack } from "../../navigation/NavigationUtils";
import { useAppDispatch, useAppSelector } from "../../redux/config/reduxHook";
import { selectMenu, setMenu } from "../../redux/reducers/menuSlice";
import Header from "../../utils/OrderComponents/Header";
import CartButton from "../../utils/OrderComponents/CartButton";
import OrderOption from "../../utils/OrderComponents/OrderOption";

interface MenuOptionParams {
  menuItem: {
    _id: string;
    imageUrl: string;
    menuName: string;
    description: string;
    price: number;
    cafeName: string;
  };
  requiredOptions: string[];
  additionalOptions: { name: string; price: number }[];
}

const CafeMenuOption: React.FC = () => {
  const menu = useAppSelector(selectMenu);
  
  const route = useRoute<RouteProp<{ params: MenuOptionParams }>>();
  const { menuItem, requiredOptions, additionalOptions } = route.params;
  const dispatch = useAppDispatch();

  const [selectedRequiredOption, setSelectedRequiredOption] = useState<string | null>(null);
  const [selectedAdditionalOptions, setSelectedAdditionalOptions] = useState<string[]>([]);

  const handleAddToCart = () => {
    if (!selectedRequiredOption) {
      Alert.alert("알림", "필수 옵션을 선택해주세요!");
      return;
    }

    dispatch((dispatch, getState) => {
      const currentMenu = getState().menu;
      const updatedItems = [...currentMenu.items];

      const foundIndex = updatedItems.findIndex(
        (selected) =>
          selected._id === menuItem._id &&
          selected.RequiredOption === selectedRequiredOption &&
          JSON.stringify(selected.AdditionalOptions) === JSON.stringify(selectedAdditionalOptions)
      );

      if (foundIndex !== -1) {
        updatedItems[foundIndex] = {
          ...updatedItems[foundIndex],
          quantity: (updatedItems[foundIndex].quantity || 1) + 1,
        };
      } else {
        updatedItems.push({
          ...menuItem,
          quantity: 1,
          RequiredOption: selectedRequiredOption,
          AdditionalOptions: selectedAdditionalOptions,
        });
      }

      const totalPrice = updatedItems.reduce(
        (sum, current) => sum + (current.price || 0) * (current.quantity || 1),
        0
      );

      const totalQuantity = updatedItems.reduce(
        (sum, current) => sum + (current.quantity || 1),
        0
      );

      dispatch(
        setMenu({
          items: updatedItems,
          price: totalPrice,
          quantitiy: totalQuantity,
        })
      );
    });

    goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title={menuItem.menuName} showCart={false} />

      {/* ✅ ScrollView 추가: 스크롤 가능하게 변경 */}
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: menuItem.imageUrl }} style={styles.image} />
        <Text style={styles.title}>{menuItem.menuName}</Text>
        <Text style={styles.description}>{menuItem.description}</Text>
        <Text style={styles.price}>{menuItem.price.toLocaleString()}원</Text>

        {/* ✅ 옵션 선택 UI */}
        <OrderOption
          requiredOptions={requiredOptions}
          selectedRequiredOption={selectedRequiredOption}
          setSelectedRequiredOption={setSelectedRequiredOption}
          additionalOptions={additionalOptions}
          selectedAdditionalOptions={selectedAdditionalOptions}
          setSelectedAdditionalOptions={setSelectedAdditionalOptions}
        />
      </ScrollView>

      {/* ✅ 장바구니 버튼을 고정 (하단) */}
      <View style={styles.cartButtonContainer}>
        <CartButton title="장바구니에 추가" onPress={handleAddToCart} />
      </View>
    </SafeAreaView>
  );
};

export default CafeMenuOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30, // 하단 여백 추가하여 버튼과 겹치지 않도록
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20, // 위쪽에서 둥글게 떨어지도록
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#8A67F8",
    textAlign: "center",
    marginBottom: 16,
  },
  cartButtonContainer: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});