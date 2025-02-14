import {
    createNavigationContainerRef,
    CommonActions,
    StackActions,
  } from "@react-navigation/native";
  
  export const navigationRef = createNavigationContainerRef();
  
  export async function navigate(routeName: string, params?: object) {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
      navigationRef.dispatch(CommonActions.navigate(routeName, params));
    }
  }
  
  export async function resetAndNavigate(routeName: string, params?: object) {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: routeName, params }],
        })
      );
    }
  }
  
  export async function goBack() {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
      navigationRef.dispatch(CommonActions.goBack());
    }
  }
  
  export async function push(routeName: string, params?: object) {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(routeName, params));
    }
  }
  
  // 스택에서 두 번 뒤로 가는 함수 추가
  export async function popTwice() {
    await navigationRef.isReady();
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.pop(2));
    }
  }
  
  export async function prepareNavigation() {
    await navigationRef.isReady();
  }
  