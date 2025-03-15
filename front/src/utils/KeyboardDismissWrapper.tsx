// src/components/KeyboardDismissWrapper.js
import React from 'react';
import { Keyboard, TouchableWithoutFeedback, View } from 'react-native';

const KeyboardDismissWrapper = ({ children }) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardDismissWrapper;