export const reverseGeocode = async (lat: string, lng: string) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyBxGkcR9TFrCBVAwzTWacT8oIb4mn2CSXU&language=ko`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.status === "OK") {
        const results = data.results;
  
        //  도로명 주소 찾기 (street_address, route)
        const roadResult = results.find(result =>
          result.types.includes("street_address") || 
          result.types.includes("route")
        );
        const roadAddress = roadResult ? roadResult.formatted_address : "도로명 주소를 찾을 수 없음";
  
        return roadAddress;
      } else {
        console.error("Geocoding failed:", data.status);
        return "주소를 가져올 수 없음";
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return "주소를 가져올 수 없음";
    }
  };