import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import TYPOS from './etc/TYPOS';
import Color from '../../constants/Colors';

interface ChatBubbleProps {
  message: string;
  isSentByMe: boolean;
  timeStamp?: string;
  imageUrl?: string;
  isLoading?: boolean;
  userImage?: string; // userImage prop 추가
}

const ChatBubble = ({ message, isSentByMe, timeStamp, imageUrl, isLoading, userImage }: ChatBubbleProps) => {
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
      {!isSentByMe && (
        <View style={styles.avatar}>
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.avatarImage} resizeMode="cover" />
          ) : (
            <Text style={styles.avatarText}>U</Text>
          )}
        </View>
      )}
      {!isSentByMe && (
        <Text style={[TYPOS.caption, { color: '#666', marginLeft: 4, marginRight: 8 }]}>
          {timeStamp}
        </Text>
      )}
      <View style={[styles.bubbleContainer, bubbleStyles]}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
            <ActivityIndicator size="small" color="#000" style={styles.loadingSpinner} />
          </View>
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          message.trim().length > 0 && <Text style={textStyles}>{message}</Text>
        )}
      </View>
      {isSentByMe && (
        <Text style={[TYPOS.caption, { color: '#666', marginLeft: 8 }]}>
          {timeStamp}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 4,
  },
  sentBubble: {
    backgroundColor: '#5b9bf9', // 이미지와 유사한 파란색
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#E5E5EA', // 이미지와 유사한 회색
    borderBottomLeftRadius: 4,
  },
  sentText: {
    color: '#fff', // 파란색 배경에 흰색 글씨
    fontSize: 16,
  },
  receivedText: {
    color: '#000',
    fontSize: 16,
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
    transform: [{ translateX: -10 }, { translateY: -10 }],
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden', // 이미지가 둥글게 보이도록
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatBubble;