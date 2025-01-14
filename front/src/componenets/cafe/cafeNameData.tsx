import cafe1 from "../../assets/cafeicon/cafe1.png";
import cafe2 from "../../assets/cafeicon/cafe2.png";
import cafe3 from "../../assets/cafeicon/cafe3.png";

// 타입 정의
interface Cafe {
  id: string;
  name: string;
  rating: number;
  icon: string; // 이미지 경로 또는 URL
  latitude: number; // 위도
  longitude: number; // 경도
}

// 데이터 배열 정의
const cafes: Cafe[] = [
  {
    id: "1",
    name: "nineteen",
    rating: 4.7,
    icon: cafe1,
    latitude: 35.1595454,
    longitude: 126.8526012,
  },
  {
    id: "2",
    name: "홍도 앞 커피",
    rating: 4.3,
    icon: cafe2,
    latitude: 35.158844,
    longitude: 126.851761,
  },
  {
    id: "3",
    name: "1학생활관 앞 커피",
    rating: 4.0,
    icon: cafe3,
    latitude: 35.157958,
    longitude: 126.852524,
  },
];

export default cafes;
