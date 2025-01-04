// ++ New Screen 
import SplashScreen from "../screens/auth/SplashSceen";
import LoginScreen from "../screens/auth/LoginScreen";
import BottomTab from "./BottomTab";
import HomeScreen from "../screens/dash/HomeScreen";
import BasketScreen from "../screens/dash/BasketScreen";
import ChattingSceen from "../screens/dash/ChattingScreen";
import ProfileScreen from "../screens/dash/ProfileScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
// ++ Screen Type ??

// ++ New Screen Stack
export const authStack = [
    {
        name: 'SplashScreen',
        component: SplashScreen,
    },
    {
        name: 'LoginScreen',
        component: LoginScreen,
    },
    {
        name: 'RegisterScreen',
        component: RegisterScreen,
    },
];

export const dashboardStack = [
    {
        name: 'BottomTab',
        component: BottomTab,
    },
    {
        name: 'HomeScreen',
        component: HomeScreen,
    },
    {
        name: 'BasketScreen',
        component: BasketScreen,
    },
    {
        name: 'ProfileScreen',
        component: ProfileScreen,
    },

];

export const mergedStacks = [...dashboardStack, ...authStack];