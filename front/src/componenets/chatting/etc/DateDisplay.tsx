import React from 'react';
import { View, Text } from 'react-native';
import Color from '../../../constants/Colors';
import TYPOS from './TYPOS';
interface Props {
  timestamp: string;
}

const DateDisplay = ({ timestamp }: Props) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={[TYPOS.body3, { color: Color.neutral3 }]}>{timestamp}</Text>
    </View>
  );
};

export default DateDisplay;
