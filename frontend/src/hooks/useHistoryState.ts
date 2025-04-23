import { useState, useEffect } from 'react';
import { getHistoryStats } from '../utils/storageUtils';

/**
 * Хук для получения информации о текущем состоянии истории
 */
export const useHistoryState = () => {
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [totalSteps, setTotalSteps] = useState(0);

  const updateHistoryState = () => {
    const { currentIndex: index, totalSteps: total } = getHistoryStats();
    setCurrentIndex(index);
    setTotalSteps(total);
  };

  useEffect(() => {
    updateHistoryState();

    window.addEventListener('historyStateChanged', updateHistoryState);

    return () => {
      window.removeEventListener('historyStateChanged', updateHistoryState);
    };
  }, []);

  return {
    currentIndex,
    totalSteps,
    hasHistory: totalSteps > 0
  };
}; 