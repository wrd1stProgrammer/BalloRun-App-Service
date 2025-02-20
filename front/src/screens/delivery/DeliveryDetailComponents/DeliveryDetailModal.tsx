import React from "react";
import NewOrderDetailModal from "./NewOrderDetailModal";
import OrderDetailModal from "./OrderDetailModal";

type DeliveryDetailProps = {
  visible: boolean;
  onClose: () => void;
  onAccept: () => void;
  deliveryItem: any;
};

const DeliveryDetail: React.FC<DeliveryDetailProps> = ({ visible, onClose, onAccept, deliveryItem }) => {
  if (!deliveryItem) return null;

  return deliveryItem.orderType === "NewOrder" ? (
    <NewOrderDetailModal visible={visible} onClose={onClose} onAccept={onAccept} deliveryItem={deliveryItem} />
  ) : (
    <OrderDetailModal visible={visible} onClose={onClose} onAccept={onAccept} deliveryItem={deliveryItem} />
  );
};

export default DeliveryDetail;