import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { authStyles } from '../AuthStepsStyles';
import { navigate } from '../../../../navigation/NavigationUtils';
import AuthHeader from '../AuthHeader';
import { saveVerifiaction, uploadFile } from '../../../../redux/actions/fileAction';
import { useAppDispatch } from '../../../../redux/config/reduxHook';
import { refetchUser } from '../../../../redux/actions/userAction';

const Step5Content: React.FC<{ images?: string | null, faceImage?: string | null }> = ({ images, faceImage }) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 관리
  const [isUploadComplete, setIsUploadComplete] = useState(false); // 업로드 완료 여부

  const imageUploadHandler = async () => {
    try {
      setIsLoading(true); // 로딩 시작
      const idImage = await dispatch(uploadFile(images, 'verification_image'));
      //배포는 필수로 위와 같이 삼항연산 제거 해야함 사진은 필수니까
      const faceImagee = faceImage ? await dispatch(uploadFile(faceImage, 'verification_image')) : null;
      //배포시 여기도 "" 제거
      const isComplete = await dispatch(saveVerifiaction(idImage, faceImagee || ""));
      console.log(isComplete);
      if (isComplete?.message === '라이더 인증 요청이 성공 됨.') { // 서버 응답 확인
        setIsUploadComplete(true);
      } else {
        console.error('업로드 실패:', isComplete);
      }
    } catch (error) {
      console.error('이미지 업로드 중 오류:', error);
    } finally {
      await dispatch(refetchUser()); //user redux 상태 업데이트
      setIsLoading(false); // 로딩 종료
    }
  };

  // 컴포넌트 마운트 시 imageUploadHandler 실행
  // 배포는 images && faceImag 로 
  useEffect(() => {
    if (images) { // 이미지 데이터가 있을 때만 실행
      imageUploadHandler();
    } else {
      setIsLoading(false); // 데이터 없으면 로딩 종료
      console.error('이미지 데이터가 누락됨:', { images, faceImage });
    }
  }, [images, faceImage]);

  // 로딩 중일 때 표시
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#666" />
        <Text style={styles.loadingText}>인증 데이터를 업로드 중입니다...</Text>
      </View>
    );
  }

  // 업로드 성공 시 표시
  return (
    <ScrollView contentContainerStyle={authStyles.container}>
      {isUploadComplete ? (
        <>
          <Text style={authStyles.title}>업로드 성공!</Text>
          <View style={authStyles.iconContainer}>
            <Ionicons name="checkmark-circle" size={50} color="#666" />
          </View>
          <Text style={authStyles.description}>
            인증에 사용된 사진들은 확인 및 보관용도 외 사용하지 않습니다
          </Text>
          <TouchableOpacity
            style={authStyles.wideEnableButton}
            onPress={() => navigate('Step6')}
          >
            <Text style={authStyles.enableButtonText}>Continue</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={authStyles.description}>업로드에 실패했습니다. 다시 시도해주세요.</Text>
      )}
    </ScrollView>
  );
};

const Step5: React.FC<{ route: any }> = ({ route }) => {
  const { images, faceImage } = route.params || {};

  return (
    <View style={{ flex: 1 }}>
      <AuthHeader step={5} totalSteps={6} />
      <Step5Content images={images} faceImage={faceImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default Step5;