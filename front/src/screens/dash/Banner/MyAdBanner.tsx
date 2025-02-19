import React, { useState, useEffect } from 'react';
import Swiper from 'react-native-swiper';
import MyAdBannerSection from './MyAdBannerSection';
import { Dimensions } from 'react-native';


export default function MyAdBanner() {
  const [slideTime, setSlideTime] = useState(1); // 초기 슬라이딩 시간 1초
  const screenWidth = Dimensions.get('window').width;

 // 임의광고 이미지 
  const bannerLists = [
    { id: 1, imageUrl: 'https://www.shutterstock.com/image-vector/summer-middle-japanese-style-simple-260nw-2135947497.jpg', title: '광고배너 1' },
    { id: 2, imageUrl: 'https://www.shutterstock.com/image-vector/new-years-first-sale-no-260nw-2178245341.jpg', title: '광고배너 2' },
    { id: 3, imageUrl: 'https://www.shutterstock.com/image-vector/bamboo-new-year-sales-banner-260nw-2077444117.jpg', title: '광고배너 3' },
  ];
  useEffect(() => {
    const autoTimer = setTimeout(() => setSlideTime(8), 1000); // 1초 후에 slideTime을 8초로 바꾸고
    return () => clearTimeout(autoTimer);
  }, [])
  
  return (
    <>
      <Swiper 
        autoplay 
        showsPagination={false} 
        width={screenWidth}
        height={60} 
        autoplayTimeout={slideTime}
      >
        {bannerLists.map((banner) => {
          return (
            <MyAdBannerSection key={banner.id} data={banner}/>
          )}
        )}
      </Swiper>
    </>
  )
}
