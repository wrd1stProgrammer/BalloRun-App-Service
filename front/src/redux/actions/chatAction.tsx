
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

  export const checkChatRoomAction =(roomId:string) => async(dispatch:any) => {
    try {
      console.log('roomID는 있냐?????',roomId);
      const res = await appAxios.get(`/chat/checkchatroom/${roomId}`);
      return res.data;
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }

  export const reportChatAction =(selectedOption:string, username:string,roomId:string) => async(dispatch:any) => {
    try {
      const res = await appAxios.post(`/chat/reportchat`,{
        reason: selectedOption,
        username: username,
        chatRoomId:roomId,
      });
      //console.log(res);
      return res.data;
    } catch (error) {
      console.error(':', error);
      throw error;
    }
  }