import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, FlatList, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";


//여기 배달하기에서 수락을 눌렀을때 상세 정보가 나오는 모달창임

const { width } = Dimensions.get("window");

type NewOrderDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  deliveryItem: any;
};

const NewOrderDetailModal: React.FC<NewOrderDetailModalProps> = ({ visible, onClose, onAccept, deliveryItem }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  if (!deliveryItem) return null;

  // 남은 시간 계산 함수
  const getRemainingTime = () => {
    const now = new Date();
    const endTime = new Date(deliveryItem.endTime);
    const diff = endTime - now;

    if (diff <= 0) return "종료됨";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `주문 만료까지 ${hours > 0 ? `${hours}시간 ` : ""}${minutes}분 남음`;
  };

  // 이미지 스크롤 시 현재 인덱스 업데이트
  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (width * 0.8));
    setCurrentImageIndex(index);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      {isMapFullScreen && (
        <Modal visible={true} animationType="fade" transparent>
          <View style={styles.fullMapOverlay}>
            <TouchableOpacity style={styles.closeMapButton} onPress={() => setIsMapFullScreen(false)}>
              <Text style={styles.closeMapButtonText}>닫기</Text>
            </TouchableOpacity>
            <MapView
              style={styles.fullscreenMap}
              initialRegion={{
                latitude: parseFloat(deliveryItem.lat),
                longitude: parseFloat(deliveryItem.lng),
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(deliveryItem.lat),
                  longitude: parseFloat(deliveryItem.lng),
                }}
                title="배달지"
              />
            </MapView>
          </View>
        </Modal>
      )}
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 헤더 */}
            <Text style={styles.header}>주문 상세</Text>
            {/* 남은 시간 */}
            <View style={styles.timeRemaining}>
              <Text style={styles.timeText}>{getRemainingTime()}</Text>
            </View>
            {/* 배달 상태 표시 */}
            <View style={[styles.statusBadge, deliveryItem.status === "cancelled" ? styles.statusCancelled : styles.statusActive]}>
              <Text style={styles.statusText}>{deliveryItem.status === "cancelled" ? "취소됨" : "대기 중"}</Text>
            </View>

            {/* 주문 정보 섹션 */}
            <View style={styles.section}>
              <View style={styles.infoRow}>
                <Text style={styles.label}>가게 이름</Text>
                <Text style={styles.value}>{deliveryItem.items[0]?.cafeName || "없음"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>주문 메뉴</Text>
                <Text style={styles.value}>{deliveryItem.items.map(i => `${i.menuName}`).join(", ") || "없음"}</Text>
              </View>



              <View style={styles.infoRow}>
                <Text style={styles.label}>배달 유형</Text>
                <Text style={styles.value}>{deliveryItem.deliveryType === "direct" ? "직접 배달" : "비대면 배달"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>배달비</Text>
                <Text style={styles.value}>{deliveryItem.deliveryFee}원</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>총 주문 가격</Text>
                <Text style={styles.highlightValue}>{deliveryItem.price}원</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>배달자 요청사항</Text>
                <Text style={styles.value}>{deliveryItem.riderRequest || "없음"}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>배달 희망 시간</Text>
                <Text style={styles.value}>{new Date(deliveryItem.startTime).toLocaleTimeString()}부터</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>주문 종료 시간</Text>
                <Text style={styles.value}>{new Date(deliveryItem.endTime).toLocaleTimeString()}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.mapTitle}>배달 위치</Text>
              <View style={styles.mapContainer}>
              <TouchableOpacity onPress={() => setIsMapFullScreen(true)} activeOpacity={1}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: parseFloat(deliveryItem.lat),
                    longitude: parseFloat(deliveryItem.lng),
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(deliveryItem.lat),
                      longitude: parseFloat(deliveryItem.lng),
                    }}
                    title="배달지"
                  />
                </MapView>
              </TouchableOpacity>
                
              </View>
              <View style={styles.infoRow1}>
                <Text style={styles.label}>배달 주소</Text>
                <Text style={styles.value}>{deliveryItem.resolvedAddress}</Text>
              </View>
              {deliveryItem.deliveryType === "direct" ? (
                <View style={styles.infoRow1}>
                  <Text style={styles.label}>배달 상세 주소</Text>
                  <Text style={styles.value}>{deliveryItem.deliveryAddress}</Text>
                </View>
              ) : (
                <View style={styles.infoRow1}>
                  <Text style={styles.label}>배달 층</Text>
                  <Text style={styles.value}>{deliveryItem.selectedFloor || "정보 없음"}</Text>
                </View>
              )}
            </View>

 

            {/* 주문 이미지 섹션 (갤러리 스타일) */}
            <View style={styles.imageContainer}>
              <Text style={styles.imageLabel}>주문 이미지</Text>
              {deliveryItem.selectedImageUris && deliveryItem.selectedImageUris.length > 0 ? (
                <View>
                  <ScrollView
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={styles.imageScroll}
                  >
                    {deliveryItem.selectedImageUris.map((uri: string, index: number) => (
                      <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                      </View>
                    ))}
                  </ScrollView>
                  {/* 페이지네이션 점 */}
                  <View style={styles.pagination}>
                    {deliveryItem.selectedImageUris.map((_: string, index: number) => (
                      <View
                        key={index}
                        style={[
                          styles.paginationDot,
                          currentImageIndex === index ? styles.paginationDotActive : styles.paginationDotInactive,
                        ]}
                      />
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>이미지가 없습니다</Text>
                </View>
              )}
            </View>

            {/* 버튼 컨테이너 */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>닫기</Text>
              </TouchableOpacity>
              {deliveryItem.status !== "cancelled" && (
                <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
                  <Text style={styles.buttonText}>배달하기</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default NewOrderDetailModal;

const styles = StyleSheet.create({
  mapTopBanner: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoRow1: {
    marginTop: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)", // 더 부드러운 오버레이
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "92%",
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    maxHeight: "78%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5, // 안드로이드 그림자
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 5,
  },
  statusBadge: {
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusActive: {
    backgroundColor: "#006AFF", // 토스 블루
  },
  statusCancelled: {
    backgroundColor: "#E8ECEF", // 회색
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "#F7F9FA", // 더 부드러운 회색
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  highlightValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#006AFF", // 강조 컬러
  },
  timeRemaining: {
    alignSelf: "center",
    backgroundColor: "#FFD400", // 토스 노랑
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginVertical: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  imageContainer: {
    marginVertical: 16,
  },
  imageLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  imageScroll: {
    borderRadius: 12,
  },
  imageWrapper: {
    width: width * 0.8,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#006AFF",
  },
  paginationDotInactive: {
    backgroundColor: "#E8ECEF",
  },
  imagePlaceholder: {
    width: width * 0.8,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8ECEF",
    borderRadius: 12,
  },
  imagePlaceholderText: {
    fontSize: 14,
    color: "#666666",
    fontWeight: "500",
  },

  acceptButton: {
    flex: 1,
    backgroundColor: "#006AFF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E8ECEF",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  fullMapOverlay: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullscreenMap: {
    flex: 1,
  },
  closeMapButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  closeMapButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
});