import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import MainNavigator from './MainNavigator';
import { navigationRef } from './NavigationUtils';

// ref={navigationRef} : 컴포넌트 외부에서 네비게이션 제어 
const Navigation: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <MainNavigator />
    </NavigationContainer>
  );
};

export default Navigation;