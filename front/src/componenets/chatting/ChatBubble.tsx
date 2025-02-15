import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import TYPOS from './etc/TYPOS';
import Color from '../../constants/Colors';

interface ChatBubbleProps {
  message: string;
  isSentByMe: boolean;
  timeStamp?: string;
  imageUrl?: string; // 이미지 URL 추가
  isLoading?: boolean; // 로딩 상태 추가
}

const ChatBubble = ({ message, isSentByMe, timeStamp, imageUrl, isLoading }: ChatBubbleProps) => {
  const bubbleStyles = isSentByMe ? styles.sentBubble : styles.receivedBubble;
  const textStyles = isSentByMe ? styles.sentText : styles.receivedText;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: isSentByMe ? 'flex-end' : 'flex-start',
      }}
    >
      {isSentByMe && (
        <Text style={[TYPOS.body3, { color: Color.neutral3, marginRight: 4 }]}>
          {timeStamp}
        </Text>
      )}
      <View style={[styles.bubbleContainer, bubbleStyles]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <ActivityIndicator size="small" color="#0000ff" style={styles.loadingSpinner} />
          </View>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          message.trim().length > 0 && <Text style={textStyles}>{message}</Text> // 빈 메시지 방지
        )}
      </View>
      {!isSentByMe && (
        <Text style={[TYPOS.body3, { color: Color.neutral3, marginLeft: 4 }]}>
          {timeStamp}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    maxWidth: '80%',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  sentBubble: {
    backgroundColor: '#3797EF',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#EFEFEF',
    borderBottomLeftRadius: 4,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: '#000',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  loadingContainer: {
    position: 'relative',
  },
  loadingSpinner: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }], // 중앙 정렬
  },
});

export default ChatBubble;