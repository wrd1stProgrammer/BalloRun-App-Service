import React, { useCallback, useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import {
  BannerAd,
  BannerAdSize,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import { useFocusEffect } from '@react-navigation/native';

const PROD_AD_UNIT_ID = 'ca-app-pub-9384938904470201/7582148564';
const AD_UNIT_ID     = PROD_AD_UNIT_ID;

const COOLDOWN_SUCCESS = 60_000; // 정상 노출 후 60s 잠금
const RETRY_NO_FILL    = 15_000; // no-fill 시 15s 재시도
const LOAD_TIMEOUT     = 8_000;  // LOADED/ERROR 이벤트 안 오면 스피너 해제

const AdMobBanner: React.FC = () => {
  const [adKey, setAdKey] = useState(() => Date.now());
  const [isLoading, setIsLoading] = useState(true);

  /** 최근 성공 노출 시각 & 로딩 타이머 */
  const lastSuccessRef = useRef<number>(0);
  const loadTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  /** 새 광고 요청 */
  const reloadBanner = useCallback((forced = false) => {
    const now = Date.now();

    // 60 초 쿨다운: 최근 성공 이후 재시도 금지
    if (!forced && now - lastSuccessRef.current < COOLDOWN_SUCCESS) return;

    setIsLoading(true);
    setAdKey(now);             // key 갱신 → remount

    // 8초 안에 LOADED/ERROR 안 오면 스피너 해제
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
    loadTimerRef.current = setTimeout(() => setIsLoading(false), LOAD_TIMEOUT);
  }, []);

  /** 포커스될 때 조건부 요청 */
  useFocusEffect(
    useCallback(() => {
      reloadBanner();
      return () => {
        if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
        if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      };
    }, [reloadBanner])
  );

  /** 로드 성공 */
  const handleLoaded = () => {
    lastSuccessRef.current = Date.now();
    setIsLoading(false);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);
  };

  /** 로드 실패 */
  const handleFailed = (e: { code?: string }) => {
    console.log('[BannerAd] failed:', e?.code);
    setIsLoading(false);
    if (loadTimerRef.current) clearTimeout(loadTimerRef.current);

    // no-fill(광고 재고 없음)만 15s 뒤 강제 재시도
    if (e?.code === 'googleMobileAds/no-fill') {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
      retryTimerRef.current = setTimeout(() => reloadBanner(true), RETRY_NO_FILL);
    }
  };

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
        onAdLoaded={handleLoaded}
        onAdFailedToLoad={handleFailed}
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
