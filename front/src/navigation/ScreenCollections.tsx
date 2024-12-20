// ++ New Screen 
import SplashScreen from "../screens/auth/SplashSceen";
import LoginScreen from "../screens/auth/LoginScreen";

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
    }
];

export const dashboardStack = [
  
];

export const mergedStacks = [...dashboardStack, ...authStack];