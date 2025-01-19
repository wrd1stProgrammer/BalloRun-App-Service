import { LatLng, Region } from 'react-native-maps';

export interface MarkerData {
  id: number;
  coordinate: LatLng;
  title: string;
  floors: string[];
  image: any;
}

export interface CustomMapViewProps {
  deliveryMethod: 'direct' | 'cupHolder';
  region: Region;
  onRegionChangeComplete: (region: Region) => void;
  jnuBoundary: LatLng[];
  markers: MarkerData[];
  onMarkerPress: (marker: MarkerData) => void;
}
