// BottomSheet.tsx
import React, { forwardRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface BottomSheetProps {}

const BottomSheet = forwardRef<BottomSheetModal, BottomSheetProps>((props, ref) => {
  // 스냅 포인트 설정
  const snapPoints = useMemo(() => ['1%', SCREEN_HEIGHT * 0.6], []);

  // 배경 컴포넌트 (Backdrop)
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      index={-1} // 처음에는 닫힌 상태
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.sheetContainer}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.headerText}>신고</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>신고할 문자를 선택하세요</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>나체 이미지 또는 성적 행위</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>혐오 발언 또는 상징</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>사기 또는 거짓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>폭력 또는 위험한 단체</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>불법 또는 규제 상품 판매</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>대놓은 또는 기물염</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>타인 사칭</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>지식재산권 침해</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>자살, 자해 또는 섭식 장애</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => { /* 더미 로직 */ }}>
            <Text style={styles.itemText}>스팸</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: '#ccc',
    width: 40,
    height: 5,
    borderRadius: 3,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  scrollContent: {
    paddingVertical: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  itemText: {
    fontSize: 16,
    color: '#000',
  },
});

export default BottomSheet;