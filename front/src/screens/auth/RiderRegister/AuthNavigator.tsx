import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RiderManual from './RiderManual';
import Step1 from './Steps/Step1';
import Step2 from './Steps/Step2';
import Step3 from './Steps/Step3';
import Step4 from './Steps/Step4';
import Step5 from './Steps/Step5';
import Step6 from './Steps/Step6';

const Stack = createStackNavigator();

const AuthNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // 기본 헤더 숨김 (AuthHeader로 대체)
        }}
      >
        <Stack.Screen name="RiderManual" component={RiderManual} />
        <Stack.Screen name="Step1" component={Step1} />
        <Stack.Screen name="Step2" component={Step2} />
        <Stack.Screen name="Step3" component={Step3} />
        <Stack.Screen name="Step4" component={Step4} />
        <Stack.Screen name="Step5" component={Step5} />
        <Stack.Screen name="Step6" component={Step6} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;