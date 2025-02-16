// ++ New Screen
import SplashScreen from "../screens/auth/SplashSceen";
import LoginScreen from "../screens/auth/LoginScreen";
import BottomTab from "./BottomTab";
import HomeScreen from "../screens/dash/HomeScreen";
import BasketScreen from "../screens/dash/BasketScreen";
import ChattingSceen from "../screens/dash/ChattingScreen";
import ProfileScreen from "../screens/dash/ProfileScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import CafeListScreen from "../screens/order/OrderCategory/CafeListScreen";
import CafeMenuListScreen from "../screens/order/CafeMenuListScreen";
import OrderWriteLoacation from "../screens/order/OrderWriteLoacation";
import DeliveryRequestListScreen from "../screens/order/DeliveryRequestListScreen";
import CafeMenuOption from "../screens/order/CafeMenuOption";
import SelectDelivery from "../screens/delivery/SelectDelivery";
import Chatting from "../screens/dash/ChattingScreen";
import LiveMap from "../screens/order/DeliveryRequestListScreenComponents/LiveMap";
import ChatRoom from "../componenets/chatting/ChatRoom";
import KakaoSample from "../screens/dash/KakaoPayApiTest/KakaoSample";
import DeliveryImage from "../screens/order/DeliveryRequestListScreenComponents/DeliveryImage";
import PayResult from "../screens/dash/KakaoPayApiTest/PayResult";
// ++ Screen Type ??
import OrderListSceen from "../screens/order/CafeListScreenComponent/OrderListScreen";
import Component from "react-native-paper/lib/typescript/components/List/ListItem";
import OrderLocationScreen from "../screens/order/OrderCategory/OrderLocationScreen";
import OrderFinalScreen from "../screens/order/OrderCategory/OrderFinalScreen";
import OrderPageScreen from "../screens/order/OrderCategory/OrderPageScreen copy";

// ++ New Screen Stack
export const authStack = [
  {
    name: "SplashScreen",
    component: SplashScreen,
  },
  {
    name: "LoginScreen",
    component: LoginScreen,
  },
  {
    name: "RegisterScreen",
    component: RegisterScreen,
  },
];

export const dashboardStack = [
  {
    name: "BottomTab",
    component: BottomTab,
  },
  {
    name: "HomeScreen",
    component: HomeScreen,
  },
  {
    name: "BasketScreen",
    component: BasketScreen,
  },
  {
    name: "ProfileScreen",
    component: ProfileScreen,
  },
  {
    name: "Chatting",
    component: Chatting,
  },
  {
    name: "ChatRoom",
    component: ChatRoom,
  },
  {
    name: "KakaoSample",
    component: KakaoSample,
  },
  {
    name: "PayResult",
    component: PayResult,
  },
  {
    name:"ChattingScreen",
    component: ChattingSceen,
  }
];

export const orderStack = [
  {
    name: "CafeListScreen",
    component: CafeListScreen,
  },
  {
    name: "CafeMenuListScreen",
    component: CafeMenuListScreen,
  },
  {
    name: "OrderWriteLoacation",
    component: OrderWriteLoacation,
  },
  {
    name: "DeliveryRequestListScreen",
    component: DeliveryRequestListScreen,
  },
  {
    name: "CafeMenuOption",
    component: CafeMenuOption,
  },
  {
    name: "OrderListScreen",
    component: OrderListSceen,
  },
  {
    name: "OrderPageScreen",
    component: OrderPageScreen,
  },
  {
    name: "OrderLocationScreen",
    component: OrderLocationScreen,
  },
  {
    name: "OrderFinalScreen",
    component: OrderFinalScreen,
  }
];

export const deliveryStack = [
  {
    name: "SelectDelivery",
    component: SelectDelivery
  },
  {
    name: "LiveMap",
    component: LiveMap
  },
  {
    name: "DeliveryImage",
    component: DeliveryImage
  }

];

export const mergedStacks = [...dashboardStack, ...authStack, ...orderStack, ...deliveryStack];
