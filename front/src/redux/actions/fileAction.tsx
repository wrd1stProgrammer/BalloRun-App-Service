import axios from 'axios';
import {Alert} from 'react-native';
import { appAxios } from '../config/apiConfig';

export const uploadFile =
  (local_uri: any, mediaType: string) => async (dispatch: any) => {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: local_uri,
        name: 'file',
        type: 'image/jpg',
      });
      formData.append('mediaType', mediaType);
      const res = await appAxios.post(`/file/orderupload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          // use upload data, since it's an upload progress
          // console.log(progressEvent);
          // iOS: {"isTrusted": false, "lengthComputable": true, "loaded": 123, "total": 98902}
        },
      });

      return res.data.mediaUrl;
    } catch (error) {
      console.log(JSON.stringify(error));
      Alert.alert('Upload error');
      return null;
    }
  };