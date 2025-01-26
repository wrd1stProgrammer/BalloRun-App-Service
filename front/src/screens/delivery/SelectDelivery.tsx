import React, { useEffect, useState } from 'react';
import DeliveryCustomMap from './SelectDeliveryComponents/DeliveryCustomMap';
import DeliveryBottomSheet from './SelectDeliveryComponents/DeliveryBottomSheet';
import { getOrderData } from '../../redux/actions/riderAction';
import { useAppDispatch } from '../../redux/config/reduxHook';

type DeliveryItem = {
  _id: string;
  items: { menuName: string; quantity: number; cafeName: string }[];
  address: string; // 배달 주소
  deliveryType: string; // 배달 유형
  startTime: string; // 주문 시작 시간
  deliveryFee: number; // 배달비
  cafeLogo: string; // 카페 로고 URL
  createdAt: string
};

function SelectDelivery() {
  const [deliveryItems, setDeliveryItems] = useState<DeliveryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const orders = await dispatch(getOrderData());
      setDeliveryItems(orders);
      setLoading(false);
    };

    fetchOrders();
  }, [dispatch]);

  return (
    <>
      <DeliveryCustomMap />
      <DeliveryBottomSheet deliveryItems={deliveryItems} loading={loading} />
    </>
  );
}

export default SelectDelivery;