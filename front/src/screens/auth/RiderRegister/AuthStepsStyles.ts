import { StyleSheet, Dimensions, Platform } from 'react-native';
import { screenWidth } from '../../../utils/Scaling';

const { width, height } = Dimensions.get('window');

// 플랫폼별 기본 패딩 및 마진 값
const basePadding = Platform.OS === 'ios' ? 20 : 15;
const baseMargin = Platform.OS === 'ios' ? 10 : 8;

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    

    paddingVertical: basePadding * 2,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // 뒤로가기 버튼만 왼쪽에 위치
    width: screenWidth,
    paddingVertical: baseMargin,
    paddingHorizontal: basePadding,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    position: 'absolute',
    top: baseMargin * 2,
    left: basePadding,
    padding: baseMargin,
    zIndex: 1, // 뒤로가기 버튼을 로딩바 위에 표시
  },
  progressBarContainer: {
    width: width - (basePadding * 2), // 패딩을 고려한 동적 너비 (오른쪽 짤림 방지)
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    position: 'absolute',
    top: baseMargin * 4 + 24, // 뒤로가기 버튼 높이(24)와 마진을 고려
    left: basePadding,
    zIndex: 0, // 로딩바는 뒤로가기 버튼 아래에 위치
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFC107',
    borderRadius: 5,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 24 : 22, // iOS는 약간 더 큰 텍스트
    fontWeight: 'bold',
    color: '#000000',
    marginTop: baseMargin * 3 + 5, // 로딩바 아래에 여유 추가
    marginBottom: baseMargin * 2,
    textAlign: 'center',
  },
  description: {
    fontSize: Platform.OS === 'ios' ? 16 : 15,
    color: '#666666',
    textAlign: 'center',
    lineHeight: Platform.OS === 'ios' ? 24 : 22,
    marginBottom: baseMargin * 2,
  },
  iconContainer: {
    marginVertical: baseMargin * 2,
    alignItems: 'center',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: baseMargin * 2,
  },
  learnMoreIcon: {
    marginRight: baseMargin,
  },
  learnMoreText: {
    fontSize: Platform.OS === 'ios' ? 14 : 13,
    color: '#666666',
    marginRight: baseMargin,
  },
  learnMoreLink: {
    fontSize: Platform.OS === 'ios' ? 14 : 13,
    color: '#666666',
    textDecorationLine: 'underline',
  },
  wideEnableButton: {
    backgroundColor: '#FFC107',
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: basePadding * 2,
    width: width * 0.8,
    left: (width - (width * 0.8)) / 2, // 중앙 정렬을 위한 동적 위치
  },
  enableButtonText: {
    fontSize: Platform.OS === 'ios' ? 16 : 15,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});