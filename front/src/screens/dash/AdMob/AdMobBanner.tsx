import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useIsFocused } from '@react-navigation/native';

const AdMobBanner = () => {
  const isFocused = useIsFocused();
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isFocused) {
      setReloadKey(prev => prev + 1);
      setIsLoading(true); // 광고 새로 요청 시 항상 로딩으로
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {isFocused && (
        <>
          {isLoading && (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="small" color="#009688" />
            </View>
          )}
          <BannerAd
            key={reloadKey}
            unitId="ca-app-pub-9384938904470201/7582148564"
            size={BannerAdSize.LARGE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
            onAdLoaded={() => setIsLoading(false)}
            onAdFailedToLoad={() => setIsLoading(false)}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  loadingWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'transparent',
  },
});

export default AdMobBanner;
