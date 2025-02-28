import React from 'react';
import { Image, View, Text, StyleSheet } from 'react-native';

interface BannerData {
  id: number;
  imageUrl: string;
  title: string;
}

interface BannerSectionProps {
  data: BannerData;
  bannerWidth: number; // bannerWidth를 props로 추가
}

const MyAdBannerSection: React.FC<BannerSectionProps> = ({ data, bannerWidth }) => {
  return (
    <View style={[styles.container, { width: bannerWidth }]}>
      <Image source={{ uri: data.imageUrl }} style={[styles.image, { width: bannerWidth }]} />
      <Text style={styles.title}>{data.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  image: {
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 16,
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