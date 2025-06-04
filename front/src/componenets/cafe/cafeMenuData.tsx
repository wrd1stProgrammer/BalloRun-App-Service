// 타입 정의
import menu1 from '../../assets/cafeData/menuImage/image-1.png'
import menu2 from '../../assets/cafeData/menuImage/image-2.png'
import menu3 from '../../assets/cafeData/menuImage/image-3.png'
import menu4 from '../../assets/cafeData/menuImage/image-4.png'


interface MenuItem {
    id: string;
    name: string;
    restaurant: string;
    price: string; // 가격 문자열 (예: '2000원')
    image: string; // 이미지 경로 또는 URL
  }

  
  
  // 데이터 배열 정의
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: '아이스아메리카노',
      restaurant: 'Rose Garden',
      price: '2000원',
      image: menu1,
    },
    {
      id: '2',
      name: '아이스티(샷추가)',
      restaurant: 'Cafenio Restaurant',
      price: '3500원',
      image: menu2,
    },
    {
      id: '3',
      name: '블루베리 스무디',
      restaurant: 'Kaji Firm Kitchen',
      price: '4000원',
      image: menu3,
    },
    {
      id: '4',
      name: '딸기 스무디',
      restaurant: 'Kabab Restaurant',
      price: '4300원',
      image: menu4,
    },
  ];
  
  export default menuItems;
  