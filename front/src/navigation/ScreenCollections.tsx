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
import NewOrderList from "../screens/order/NewOrder/NewOrderList";
import OrderDetailScreen from "../screens/order/NewOrder/OrderDetailScreen";
import RiderManual from "../screens/auth/RiderRegister/RiderManual";
import Step1 from "../screens/auth/RiderRegister/Steps/Step1";
import Step2 from "../screens/auth/RiderRegister/Steps/Step2";
import Step3 from "../screens/auth/RiderRegister/Steps/Step3";
import Step4 from "../screens/auth/RiderRegister/Steps/Step4";
import Step5 from "../screens/auth/RiderRegister/Steps/Step5";
import Step6 from "../screens/auth/RiderRegister/Steps/Step6";
import NewLocationBottom from "../screens/order/OrderWriteLocationComponent/NewLocationBottom";
import LawScreen from "../screens/dash/Profile/LawScreen";
import TermsScreen from "../screens/dash/Profile/LawScreenChild.tsx/TermsScreen";
import PrivacyPolicyScreen from "../screens/dash/Profile/LawScreenChild.tsx/PrivacyPolicyScreen";
import PrivacyConsentScreen from "../screens/dash/Profile/LawScreenChild.tsx/PrivacyConsentScreen";
import LocationServiceTermsScreen from "../screens/dash/Profile/LawScreenChild.tsx/LocationServiceTermsScreen";
import CarrierAgreementScreen from "../screens/dash/Profile/LawScreenChild.tsx/CarrierAgreementScreen";
import AccountRegistrationScreen from "../screens/dash/Profile/AccountRegistrationScreen";
import WithdrawScreen from "../screens/dash/Profile/WithdrawScreen";
import FirstScreen from "../screens/auth/Register/FirstScreen";
import SecondScreen from "../screens/auth/Register/SecondScreen";
import ThirdScreen from "../screens/auth/Register/ThirdScreen";
import FourthScreen from "../screens/auth/Register/FourthScreen";
import CancelOrderScreen from "../screens/order/NewOrder/OrderCancel/CancelOrderScreen";
import EditProfileScreen from "../screens/dash/Profile/EditProfileScreen";
import AddressSettingScreen from "../screens/dash/Address/AddressSettingScreen";
import AddressSearchScreen from "../screens/dash/Address/AddressSearchScreen";
import AddressDetailScreen from "../screens/dash/Address/AddressDetailScreen";
import NoticeScreen from "../screens/dash/Notice/NoticeScreen";
import CreateNoticeScreen from "../screens/dash/Notice/CreateNoticeScreen";
import NoticeDetail from "../screens/dash/Notice/NoticeDetail";
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
  {
    name:"FirstScreen",
    component:FirstScreen,
  },
  {
    name:"SecondScreen",
    component:SecondScreen,
  },
  {
    name:"ThirdScreen",
    component:ThirdScreen,
  },
  {
    name:"FourthScreen",
    component:FourthScreen
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
    name: "ChattingScreen",
    component: ChattingSceen,
  },
  {
    name: "RiderManual",
    component: RiderManual,
  },
  {
    name: "Step1",
    component: Step1,
  },
  {
    name: "Step2",
    component: Step2,
  },
  {
    name: "Step3",
    component: Step3,
  },
  {
    name: "Step4",
    component: Step4,
  },
  {
    name: "Step5",
    component: Step5,
  },
  {
    name: "Step6",
    component: Step6,
  },
  {
    name:"LawScreen",
    component: LawScreen,
  },
  {
    name:"TermsScreen",
    component: TermsScreen
  },
  {
    name:"PrivacyPolicy",
    component: PrivacyPolicyScreen
  },
  {
    name: "PrivacyConsentScreen",
    component:PrivacyConsentScreen,
  },
  {
    name: "LocationServiceTermsScreen",
    component: LocationServiceTermsScreen,
  },
  {
    name:"CarrierAgreementScreen",
    component:CarrierAgreementScreen
  },
  {
    name:"AccountRegistrationScreen",
    component: AccountRegistrationScreen
  },
  {
    name:"WithdrawScreen",
    component:WithdrawScreen
  },
  {
    name:"CancelOrderScreen",
    component:CancelOrderScreen,
  },
  {
    name:"AddressSettingScreen",
    component:AddressSettingScreen
  },
  {
    name:"AddressSearchScreen",
    component:AddressSearchScreen
  },
  {
    name:"AddressDetailScreen",
    component:AddressDetailScreen
  },
  {
    name:"CreateNotice",
    component:CreateNoticeScreen,
  },
  {
    name:"NoticeDetail",
    component:NoticeDetail,
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
    name: "NewLocationBottom",
    component: NewLocationBottom,
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
  },
  {
    name: "OrderDetailScreen",
    component: OrderDetailScreen,
  },
  {
    name:"EditProfileScreen",
    component: EditProfileScreen,
  },
  {
    name:"NoticeScreen",
    component:NoticeScreen,
  }
];

export const deliveryStack = [
  {
    name: "SelectDelivery",
    component: SelectDelivery,
  },
  {
    name: "LiveMap",
    component: LiveMap,
  },
  {
    name: "DeliveryImage",
    component: DeliveryImage,
  },
];

export const mergedStacks = [...dashboardStack, ...authStack, ...orderStack, ...deliveryStack];