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
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { goBack, navigate } from "../../../navigation/NavigationUtils";
import { RouteProp, useRoute } from "@react-navigation/native";
import { launchImageLibrary, ImagePickerResponse, ImageLibraryOptions } from 'react-native-image-picker';
import Header from "../../../utils/OrderComponents/Header";
import { useAppSelector } from "../../../redux/config/reduxHook";
import { selectUser } from "../../../redux/reducers/userSlice";

type RootStackParamList = {
  OrderPageScreen: { name: string };
};

type OrderPageScreenRouteProp = RouteProp<RootStackParamList, "OrderPageScreen">;

const OrderPageScreen = () => {
  const user = useAppSelector(selectUser);
  const route = useRoute<OrderPageScreenRouteProp>();
  const { name } = route.params;

  const [orderDetails, setOrderDetails] = useState("");
  const [priceOffer, setPriceOffer] = useState("");
  const [deliveryFee, setDeliveryFee] = useState("");
  const [images, setImages] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState("direct");

  useEffect(() => {
    if (images) {
      console.log(images, 'images 정보');
    }
  }, [images]);

  useEffect(() => {
    // 화면이 마운트될 때 키보드 강제 닫기(깜빡임 예방)
    Keyboard.dismiss();
  }, []);

  const handleNextPress = () => {
    if (deliveryMethod === "direct" && !user?.address) {
      Alert.alert("주소 설정 필요", "홈에서 배달 주소를 지정해주세요.");
      return;
    }
    navigate(
      deliveryMethod === "direct" ? "OrderFinalScreen" : "OrderCupHolderLocationScreen",
      {
        name,
        orderDetails,
        priceOffer: priceOffer || "0",
        deliveryFee: deliveryFee || "0",
        images,
        deliveryMethod,
      }
    );
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
      setImages(response.assets[0].uri || null);
    }
  };

  const handleRemoveImage = () => {
    setImages(null);
  };

  const handlePriceChange = (text: string, setter: (value: string) => void) => {
    const numericValue = text.replace(/[^0-9]/g, ""); // 숫자만 허용
    setter(numericValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1 }}>
              <Header title={name} />
              <View style={styles.content}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>무엇을 요청할까요?</Text>
                    <Text style={styles.sectionSubtitle}>사진을 첨부해주시면 배달원에게 도움이 됩니다</Text>
                  </View>
                  <TouchableOpacity onPress={images ? handleRemoveImage : handleImagePicker}>
                    <Ionicons name={images ? "close" : "camera-outline"} size={24} color="#000" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={styles.textArea}
                  placeholder="배달할 품목, 수량 등 입력"
                  placeholderTextColor="#999"
                  multiline
                  value={orderDetails}
                  onChangeText={setOrderDetails}
                />

                <Text style={styles.sectionTitle}>주문상품 가격</Text>
                <View style={styles.priceInputContainer}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={priceOffer}
                    onChangeText={(text) => handlePriceChange(text, setPriceOffer)}
                  />
                  <Text style={styles.wonText}>원</Text>
                </View>

                <Text style={styles.sectionTitle}>배달팁</Text>
                <View style={styles.priceInputContainer}>
                  <TextInput
                    style={styles.priceInput}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={deliveryFee}
                    onChangeText={(text) => handlePriceChange(text, setDeliveryFee)}
                  />
                  <Text style={styles.wonText}>원</Text>
                </View>

                <View style={styles.deliveryMethodContainer}>
                  <Text style={styles.sectionTitle}>배달 방식</Text>
                  <View style={styles.deliveryButtonsContainer}>
                    <TouchableOpacity
                      style={[styles.deliveryButton, deliveryMethod === "direct" && styles.selectedButton]}
                      onPress={() => setDeliveryMethod("direct")}
                    >
                      <Text style={deliveryMethod === "direct" ? styles.selectedButtonText : styles.buttonText}>
                        직접배달
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.deliveryButton, deliveryMethod === "cupHolder" && styles.selectedButton]}
                      
                    >
                      <Text style={deliveryMethod === "cupHolder" ? styles.selectedButtonText : styles.buttonText}>
                        보관소 (서비스 준비 중)
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={deliveryMethod === "cupHolder" ? styles.selectedButtonText : styles.buttonText}>
                    {user?.address || "주소를 설정하세요"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.nextButton, !orderDetails && styles.nextButtonInactive]}
                disabled={!orderDetails}
                onPress={handleNextPress}
              >
                <Text style={styles.nextButtonText}>다음</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: "#999",
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    textAlignVertical: "top",
    fontSize: 16,
    color: "#000",
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 8,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  priceInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#000",
    textAlign: "right",
  },
  wonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  deliveryMethodContainer: {
    marginBottom: 24,
  },
  deliveryButtonsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  deliveryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  selectedButton: {
    backgroundColor: "#3384FF",
  },
  buttonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  selectedButtonText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  nextButton: {
    backgroundColor: "#3384FF",
    paddingVertical: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  nextButtonInactive: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default OrderPageScreen;
