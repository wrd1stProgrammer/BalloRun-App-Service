// CustomMapViewProps.ts
import { Region, LatLng } from 'react-native-maps';

export interface CustomMapViewProps {
  region: Region; // 지도 초기 영역 정보
  onRegionChangeComplete: (region: Region) => void; // 영역 변경 콜백
  jnuBoundary: LatLng[]; // 지도 상의 다각형 경계 데이터
  deliveryMethod: any
}
