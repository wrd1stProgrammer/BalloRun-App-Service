import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const AdMobBanner = () => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId="ca-app-pub-9384938904470201/7582148564" // 테스트용 ID (배포 시 실제 ID로 변경)
        size={BannerAdSize.LARGE_BANNER} // 320x100 크기
        requestOptions={{
          requestNonPersonalizedAdsOnly: true, // 비개인화 광고 요청
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50, // 예시로 100px로 설정. MyAdBannerSection 높이에 맞춰주세요
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdMobBanner;