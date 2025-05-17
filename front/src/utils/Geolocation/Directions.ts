// // @ts-ignore
// import Polyline from '@mapbox/polyline';

// import { API_KEY } from '@env';


// export const getWalkingDirections = async (
//   origin: { lat: number; lng: number },
//   destination: { lat: number; lng: number }
// ): Promise<{ latitude: number; longitude: number }[]> => {
//   try {
//     const response = await fetch(
//       `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=walking&key=${API_KEY}`
//     );
//     const data = await response.json();
//     console.log("Google Directions API 응답 데이터:", data);
//     if (data.routes.length > 0) {
//       const points = Polyline.decode(data.routes[0].overview_polyline.points);
//       console.log("디코딩된 경로 좌표 (Polyline):", points);
//       if (!points || points.length === 0) {
//         console.warn("Polyline decode 결과가 비어 있습니다.");
//       }
//       return points.map(([latitude, longitude]: [number, number]) => ({ latitude, longitude }));
//     }
//   } catch (error) {
//     console.error('Failed to fetch walking directions:', error);
//   }
//   return [];
// };