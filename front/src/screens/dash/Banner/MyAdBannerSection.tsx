import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { screenWidth } from '../../../utils/Scaling';
// data의 타입 정의
interface BannerData {
  id: number;
  imageUrl: string;
  title: string;
}

// props의 타입 정의
interface BannerSectionProps {
  data: BannerData;
}

const MyAdBannerSection: React.FC<BannerSectionProps> = ({ data }) => {
  const screenWidth = Dimensions.get('window').width;
    
  return (
    <View style={styles.container}>
      <Image source={{ uri: data.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{data.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    position: 'absolute',
    bottom: 20,
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default MyAdBannerSection;