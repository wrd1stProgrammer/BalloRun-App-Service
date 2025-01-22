// ++ New Screen
import SplashScreen from "../screens/auth/SplashSceen";
import LoginScreen from "../screens/auth/LoginScreen";
import BottomTab from "./BottomTab";
import HomeScreen from "../screens/dash/HomeScreen";
import BasketScreen from "../screens/dash/BasketScreen";
import ChattingSceen from "../screens/dash/ChattingScreen";
import ProfileScreen from "../screens/dash/ProfileScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import CafeListScreen from "../screens/order/CafeListScreen";
import CafeMenuListScreen from "../screens/order/CafeMenuListScreen";
import OrderWriteLoacation from "../screens/order/OrderWriteLoacation";
import DeliveryRequestListScreen from "../screens/order/DeliveryRequestListScreen";
import CafeMenuOption from "../screens/order/CafeMenuOption";
import SelectDelivery from "../screens/delivery/SelectDelivery";
// ++ Screen Type ??

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
    name:"DeliveryRequestListScreen",
    component: DeliveryRequestListScreen,
  },
  {
    name:"CafeMenuOption",
    component: CafeMenuOption,
  },
];

export const deliveryStack = [
  {
    name: "SelectDelivery",
    component: SelectDelivery},
    
];

export const mergedStacks = [...dashboardStack, ...authStack, ...orderStack, ...deliveryStack];
