import React, { useEffect, useState } from 'react';
import DeliveryCustomMap from './SelectDeliveryComponents/DeliveryCustomMap';
import DeliveryBottomSheet from './SelectDeliveryComponents/DeliveryBottomSheet';
import { getOrderData } from '../../redux/actions/riderAction';
import { useAppDispatch } from '../../redux/config/reduxHook';

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string;
  deliveryType: string; // 주문 유형 ('컵홀더' 또는 '직접')
  startTime: string;
  deliveryFee: number;
  cafeLogo: string;
  createdAt: string;
  endTime: string;
  lat: string;
  lng: string;
};

function SelectDelivery() {
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]); // 전체 주문 데이터
  const [filteredItems, setFilteredItems] = useState<DeliveryItem[]>([]); // 필터링된 주문 데이터
  const [selectedDeliveryItem, setSelectedDeliveryItem] = useState<DeliveryItem | null>(null); // 선택된 주문
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const orders = await dispatch(getOrderData());
      setDeliveryItems(orders);
      setFilteredItems(orders); // 초기 상태는 전체 주문 표시
      setLoading(false);
    };

    fetchOrders();
  }, [dispatch]);

  const handleMarkerSelect = (item: DeliveryItem | null) => {
    setSelectedDeliveryItem(item); // 선택된 주문 설정
  };

  const handleFilter = (type: string | null) => {
    if (type) {
      // 특정 필터 적용
      setFilteredItems(deliveryItems.filter((item) => item.deliveryType === type));
    } else {
      // 필터 해제 (전체 보기)
      setFilteredItems(deliveryItems);
    }
    setSelectedDeliveryItem(null); // 선택된 주문 초기화
  };

  return (
    <>
      <DeliveryCustomMap
        deliveryItems={selectedDeliveryItem ? [selectedDeliveryItem] : filteredItems}
        loading={loading}
        onMarkerSelect={handleMarkerSelect}
        onFilter={handleFilter} // 필터 핸들러 전달
      />
      <DeliveryBottomSheet
        deliveryItems={selectedDeliveryItem ? [selectedDeliveryItem] : filteredItems}
        loading={loading}
      />
    </>
  );
}

export default SelectDelivery;
