import {useState} from 'react';

export function useOverlay() {
  const [isOverlayVisible, setModalVisible] = useState(false);
  
  const toggleOverlay = () => {
    setModalVisible(!isOverlayVisible);
  };

  return {
    isOverlayVisible,
    toggleOverlay
  };
}