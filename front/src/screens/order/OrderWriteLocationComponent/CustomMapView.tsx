import React from 'react';
import { StyleSheet } from 'react-native';
import MapView, { Marker, Polygon, PROVIDER_GOOGLE } from 'react-native-maps';
import CustomMarker from './CustomMarker'; // CustomMarker 컴포넌트 임포트
import { CustomMapViewProps } from './CustomMapViewProps'; // Props 타입 정의 임포트

const CustomMapView: React.FC<CustomMapViewProps> = ({ deliveryMethod, region, onRegionChangeComplete, jnuBoundary }) => {
  const [floor, setFloor] = React.useState(false);

  React.useEffect(() => {
    if (deliveryMethod === "direct") {
      setFloor(true);
    } else {
      setFloor(false);
    }
  }, [deliveryMethod]);


  // 여기 임시 데이터로 다른 파일로 옮겨야 할듯듯
  const markers = React.useMemo(() => [
    {
      id: 1,
      coordinate: { latitude: 35.179661, longitude: 126.90638 },
      title: 'AI융합대학',
      description: '여기는 마커 1입니다.',
      image: require('../../../assets/images/AIpart.png'), // 로컬 이미지 파일
    },
    {
      id: 2,
      coordinate: { latitude: 35.177735, longitude: 126.909421 },
      title: '공과대학',
      description: '여기는 마커 2입니다.',
      image: require('../../../assets/images/Engineerpart.png'), // 로컬 이미지 파일
    },
  ], []);
  // 임시 데이터

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={region}
      onRegionChangeComplete={onRegionChangeComplete}
    >
      <Polygon
        coordinates={jnuBoundary}
        strokeColor="rgba(0,0,255,0.8)"
        fillColor="rgba(0,0,255,0.1)"
        strokeWidth={2}
      />
      
      {/* floor이 false일 때만 렌더링 */}

          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            title="현재 위치"
          />
      {!floor && (
        <>
          {markers.map((marker) => (
            <Marker key={marker.id} coordinate={marker.coordinate} title={marker.title} description={marker.description}>
              <CustomMarker marker={marker} />
            </Marker>
          ))}
        </>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default CustomMapView;
