
import { appAxios } from '../config/apiConfig';
import {setUser} from '../reducers/userSlice';
import {persistor} from '../config/store';
import { resetAndNavigate } from '../../navigation/NavigationUtils';

export const getCafeMenusBycafeName = (cafeName:string) => async(dispatch: any) => {
    try {
        const res = await appAxios.get(`/cafe/getmenus/${cafeName}`);
        // console.log(res);
        return res.data;
      } catch (error: any) {
        console.log('카페메뉴 불러오기 에러 :  ->', error);
      }
};