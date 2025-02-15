
import { appAxios } from '../config/apiConfig';
import {setUser} from '../reducers/userSlice';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';


// 채팅방 나가기 (서버에서 chatRoom 삭제)
export const chatExitHandler =(chatRoomId:string) => async(dispatch:any) => {
    try {
      const res = await appAxios.patch(`/chat/leave/${chatRoomId}`);
      console.log(res);
      return res.data;
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }