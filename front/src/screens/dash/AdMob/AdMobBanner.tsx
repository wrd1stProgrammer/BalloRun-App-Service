import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useFocusEffect } from '@react-navigation/native';

const AD_UNIT_ID = 'ca-app-pub-9384938904470201/7582148564';
const COOLDOWN   = 60_000;  // 60s 정책 권장
const LOAD_TIMEOUT = 8_000; // 이벤트 안 오면 로딩 종료

const AdMobBanner: React.FC = () => {
  const [adKey, setAdKey] = useState(() => Date.now());
  const [isLoading, setIsLoading] = useState(true);

  /** 최근 로드 시각 & 타이머 ref */
  const lastLoadRef = useRef<number>(Date.now());
  const loadTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 실제 배너 재요청 */
  const reloadBanner = useCallback(() => {
    const now = Date.now();
    if (now - lastLoadRef.current < COOLDOWN) return; // 쿨다운

    lastLoadRef.current = now;
    setAdKey(now);          // 새 mount
    setIsLoading(true);

    // ❶ 로딩 이벤트가 8s 안 오면 스피너 꺼주기
    if (loadTimer.current) clearTimeout(loadTimer.current);
    loadTimer.current = setTimeout(() => setIsLoading(false), LOAD_TIMEOUT);
  }, []);

  /** 포커스될 때 조건부 새로고침 */
  useFocusEffect(
    useCallback(() => {
      reloadBanner();
      return () => {
        if (loadTimer.current) clearTimeout(loadTimer.current);
      };
    }, [reloadBanner])
  );

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator size="small" color="#009688" />
        </View>
      )}

      <BannerAd
        key={adKey}
        unitId={AD_UNIT_ID}
        size={BannerAdSize.LARGE_BANNER}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdLoaded={() => {
          setIsLoading(false);
          if (loadTimer.current) clearTimeout(loadTimer.current);
        }}
        onAdFailedToLoad={(e) => {
          console.log('[BannerAd] failed:', e?.code);
          setIsLoading(false);
          if (loadTimer.current) clearTimeout(loadTimer.current);
        }}
      />
    </View>
  );
};

export default AdMobBanner;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
