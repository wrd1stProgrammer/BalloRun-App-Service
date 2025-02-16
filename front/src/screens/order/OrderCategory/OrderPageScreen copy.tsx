import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';

type RootStackParamList = {
  OrderPageScreen: { name: string };
};

type OrderPageScreenRouteProp = RouteProp<RootStackParamList, "OrderPageScreen">;

const OrderPageScreen = () => {
  const route = useRoute<OrderPageScreenRouteProp>();
  const { name } = route.params;

  const [orderDetails, setOrderDetails] = useState("");
  const [priceOffer, setPriceOffer] = useState("0원");
  const [deliveryTip, setDeliveryTip] = useState("0원");
  const [extraRequests, setExtraRequests] = useState("");
  const [images, setImages] = useState<string | null>(null); // uri만 저장


  useEffect(() => {
    if (images) {
      console.log(images, 'images 정보');
    }
  }, [images]);

  const handleNextPress = () => {
    navigate("OrderLocationScreen", {
      name,
      orderDetails,
      priceOffer,
      deliveryTip,
      extraRequests,
      images: images,
    });
  };

  const handleImagePicker = async () => {
    const option: ImageLibraryOptions = {
      mediaType: "photo",
      selectionLimit: 1,
      includeBase64: true,
    };

    const response: ImagePickerResponse = await launchImageLibrary(option);

    if (response.didCancel) Alert.alert('취소');
    else if (response.errorMessage) Alert.alert('Error: ' + response.errorMessage);
    else if (response.assets && response.assets.length > 0) {
      const uri = response.assets[0].uri;
      setImages(uri || null);
    }
  };

  const handleRemoveImage = () => {
    setImages(null); // 이미지 상태를 null로 설정하여 제거
  };

  const handlePriceChange = (text: string, setter: (value: string) => void) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setter(`${numericValue}원`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => goBack()}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{name}</Text>
        <TouchableOpacity onPress={() => alert("고객센터 연결")}> 
          <Text style={styles.customerCenterText}>고객센터</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>무엇을 요청할까요?</Text>
          <TouchableOpacity 
            onPress={images ? handleRemoveImage : handleImagePicker}
          >
            <Ionicons 
              name={images ? "close-circle" : "camera"} 
              size={24} 
              color={images ? "red" : "black"} 
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textArea}
          placeholder="배달할 품목, 수량 등 입력"
          placeholderTextColor="#B0B0B0"
          multiline
          value={orderDetails}
          onChangeText={setOrderDetails}
        />

        <Text style={styles.sectionTitle}>주문상품 가격</Text>
        <TextInput
          style={[styles.input, styles.rightAlignedInput]}
          placeholder="0원"
          placeholderTextColor="#B0B0B0"
          keyboardType="numeric"
          value={priceOffer}
          onChangeText={(text) => handlePriceChange(text, setPriceOffer)}
        />

        <Text style={styles.sectionTitle}>배달팁</Text>
        <TextInput
          style={[styles.input, styles.rightAlignedInput]}
          placeholder="0원"
          placeholderTextColor="#B0B0B0"
          keyboardType="numeric"
          value={deliveryTip}
          onChangeText={(text) => handlePriceChange(text, setDeliveryTip)}
        />

        <TextInput
          style={styles.textArea}
          placeholder="주문 요청사항 입력"
          placeholderTextColor="#B0B0B0"
          multiline
          value={extraRequests}
          onChangeText={setExtraRequests}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, orderDetails ? styles.buttonActive : styles.buttonInactive]}
        disabled={!orderDetails}
        onPress={handleNextPress}
      >
        <Text style={styles.buttonText}>다음</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  customerCenterText: {
    fontSize: 14,
    color: "#555",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textArea: {
    height: 150,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: "top",
  },
  input: {
    height: 50,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  rightAlignedInput: {
    textAlign: "right",
  },
  button: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonActive: {
    backgroundColor: "#000",
  },
  buttonInactive: {
    backgroundColor: "#D3D3D3",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderPageScreen;