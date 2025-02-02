import { useState } from "react";
import { View, Modal } from "react-native";

const useOverlay = () => {
  const [overlayContent, setOverlayContent] = useState<JSX.Element | null>(
    null
  );

  const open = (content: JSX.Element) => {
    setOverlayContent(content);
  };

  const close = () => {
    setOverlayContent(null);
  };

  const OverlayComponent = () => (
    <Modal transparent visible={!!overlayContent} animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {overlayContent}
      </View>
    </Modal>
  );

  return { open, close, OverlayComponent };
};

export default useOverlay;
