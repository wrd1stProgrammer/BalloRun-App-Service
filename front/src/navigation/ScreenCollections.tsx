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
// import NewLocationBottom from "../screens/order/OrderWriteLocationComponent/NewLocationBottom";
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
import TalTaeScreen from "../screens/dash/Profile/TalTaeScreen";
import SettingScreen from "../screens/dash/Profile/SettingScreen";
import AddressEditScreen from "../screens/dash/Address/AddressEditScreen";
import AddressEditDetailScreen from "../screens/dash/Address/AddressEditDetailScreen";
import OrderDirectLocationScreen from "../screens/order/OrderCategory/OrderDirectLocationScreen";
import OrderCupHolderLocationScreen from "../screens/order/OrderCategory/OrderCupHolderLocationScreen";
import Component from "react-native-paper/lib/typescript/components/List/ListItem";
import FindMap from "../screens/dash/Address/Map/FindMap";
import NotificationSettingsScreen from "../screens/dash/Profile/Settings/NotificationSettingsScreen";
import AccountManagementScreen from "../screens/dash/Profile/Settings/AccountManagementScreen";
import BankAccountEditScreen from "../screens/dash/Profile/Settings/BankAccountEditScreen";
import PortOneSample from "../screens/dash/KakaoPayApiTest/PortOne/PortoneSample";
import IdentityVerificationSample from "../screens/dash/KakaoPayApiTest/PortOne/IdentityVerificationSample";
import PortoneCard from "../screens/dash/KakaoPayApiTest/PortOne/PortoneCard";
import DeliveryNoticeScreen from "../screens/order/OrderCategory/notice/DeliveryNoticeScreen";
import DeliveryDetail from "../screens/delivery/DeliveryDetailComponents/DeliveryDetail";
import FindIdScreen from "../screens/auth/FindId/\bFindIdScreen";
import ResetPasswordScreen from "../screens/auth/FindPW/ResetPasswordScreen";
import FindPasswordScreen from "../screens/auth/FindPW/FindPasswordScreen";
import EventScreen from "../screens/dash/Notice/EventScreen";
import SocialRegisterScreen from "../screens/auth/Register/SocialRegister";
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
    name: "FindMap",
    component: FindMap
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
    name:"AddressEditScreen",
    component:AddressEditScreen
  },
  {
    name:"AddressEditDetailScreen",
    component:AddressEditDetailScreen
  },
  {
    name:"CreateNotice",
    component:CreateNoticeScreen,
  },
  {
    name:"NoticeDetail",
    component:NoticeDetail,
  },
  {
    name:"SettingScreen",
    component:SettingScreen,
  },
  {
    name:"NotificationSettingsScreen",
    component: NotificationSettingsScreen,
  },
  {
    name:"AccountManagementScreen",
    component: AccountManagementScreen,
  },
  {
    name:"BankAccountEditScreen",
    component: BankAccountEditScreen,
  },
  {
    name:"PortoneSample",
    component:PortOneSample,
  },
  {
    name:"PortoneCard",
    component: PortoneCard,
  },
  {
    name:"IdentityVerificationSample",
    component: IdentityVerificationSample,
  },
  {
    name:"DeliveryNoticeScreen",
    component: DeliveryNoticeScreen,
  },
  {
    name:"FindIdScreen",
    component:FindIdScreen,
  },
  {
    name:"ResetPasswordScreen",
    component:ResetPasswordScreen
  },
  {
    name:"FindPasswordScreen",
    component:FindPasswordScreen,
  },
  {
    name:"EventScreen",
    component: EventScreen,
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
    name: "OrderDirectLocationScreen",
    component: OrderDirectLocationScreen,
  },
  {
    name: "OrderCupHolderLocationScreen",
    component: OrderCupHolderLocationScreen,
  },
  // {
  //   name: "NewLocationBottom",
  //   component: NewLocationBottom,
  // },
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
  },
  {
    name:"TalTaeScreen",
    component:TalTaeScreen,
  },
  {
    name:"SocialRegisterScreen",
    component: SocialRegisterScreen,
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
  {
    name: "DeliveryDetail",
    component: DeliveryDetail
  }
];

export const mergedStacks = [...dashboardStack, ...authStack, ...orderStack, ...deliveryStack];