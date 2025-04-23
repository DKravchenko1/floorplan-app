import { FloorPlan, ZoningResult } from '../types';

const STORAGE_KEYS = {
  ACTIVE_PLAN: 'floorplan_active_plan',
  HISTORY: 'floorplan_history',
  HISTORY_INDEX: 'floorplan_history_index',
};

export interface StorageState {
  floorPlan: FloorPlan | null;
  zoningResult: ZoningResult | null;
  timestamp: number;
}

const notifyHistoryStateChanged = () => {
  const event = new Event('historyStateChanged');
  window.dispatchEvent(event);
};

/**
 * Сохраняет активный план в localStorage
 */
export const saveActivePlan = (plan: FloorPlan | null, zoning: ZoningResult | null): void => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.ACTIVE_PLAN, 
      JSON.stringify({ plan, zoning, timestamp: Date.now() })
    );
  } catch (error) {
    console.error('Ошибка при сохранении активного плана в localStorage:', error);
  }
};

/**
 * Получает активный план из localStorage
 */
export const getActivePlan = (): { plan: FloorPlan | null, zoning: ZoningResult | null } => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVE_PLAN);
    if (stored) {
      const data = JSON.parse(stored);
      return { 
        plan: data.plan, 
        zoning: data.zoning 
      };
    }
  } catch (error) {
    console.error('Ошибка при получении активного плана из localStorage:', error);
  }
  return { plan: null, zoning: null };
};

/**
 * Сохраняет новое состояние в историю
 */
export const saveToHistory = (plan: FloorPlan | null, zoning: ZoningResult | null): void => {
  try {
    const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]';
    const historyIndexStr = localStorage.getItem(STORAGE_KEYS.HISTORY_INDEX) || '-1';
    
    let history: StorageState[] = JSON.parse(historyStr);
    let historyIndex = parseInt(historyIndexStr, 10);
    
    const newState: StorageState = {
      floorPlan: plan,
      zoningResult: zoning,
      timestamp: Date.now()
    };
    
    history = history.slice(0, historyIndex + 1);
    
    history.push(newState);
    
    if (history.length > 10) {
      history = history.slice(history.length - 10);
    }
    
    historyIndex = history.length - 1;
    
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    localStorage.setItem(STORAGE_KEYS.HISTORY_INDEX, historyIndex.toString());
    
    notifyHistoryStateChanged();
  } catch (error) {
    console.error('Ошибка при сохранении в историю:', error);
  }
};

/**
 * Получает историю и текущий индекс
 */
export const getHistory = (): { history: StorageState[], currentIndex: number } => {
  try {
    const historyStr = localStorage.getItem(STORAGE_KEYS.HISTORY) || '[]';
    const historyIndexStr = localStorage.getItem(STORAGE_KEYS.HISTORY_INDEX) || '-1';
    
    return {
      history: JSON.parse(historyStr),
      currentIndex: parseInt(historyIndexStr, 10)
    };
  } catch (error) {
    console.error('Ошибка при получении истории из localStorage:', error);
    return { history: [], currentIndex: -1 };
  }
};

/**
 * Получает статистику по истории
 */
export const getHistoryStats = (): { currentIndex: number, totalSteps: number } => {
  try {
    const { history, currentIndex } = getHistory();
    return {
      currentIndex,
      totalSteps: history.length
    };
  } catch (error) {
    console.error('Ошибка при получении статистики истории:', error);
    return { currentIndex: -1, totalSteps: 0 };
  }
};

/**
 * Выполняет переход к предыдущему состоянию (undo)
 */

type HistoryActionResult = {
  plan: FloorPlan | null;
  zoning: ZoningResult | null;
  newIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export const undoAction = (): HistoryActionResult => {
  try {
    const { history, currentIndex } = getHistory();
    
    if (currentIndex <= 0 || history.length === 0) {
      console.warn('Нет доступных состояний для отмены. Индекс:', currentIndex, 'Длина истории:', history.length);
      return { 
        plan: null, 
        zoning: null, 
        newIndex: currentIndex,
        canUndo: false, 
        canRedo: currentIndex < history.length - 1 
      };
    }
    
    const newIndex = currentIndex - 1;
    const prevState = history[newIndex];
    
    console.log('Выполнена отмена действия. Новый индекс:', newIndex);
    console.log('Предыдущее состояние:', prevState);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY_INDEX, newIndex.toString());
    
    saveActivePlan(prevState.floorPlan, prevState.zoningResult);
    
    notifyHistoryStateChanged();
    
    return {
      plan: prevState.floorPlan,
      zoning: prevState.zoningResult,
      newIndex,
      canUndo: newIndex > 0,
      canRedo: true
    };
  } catch (error) {
    console.error('Ошибка при отмене действия:', error);
    return { plan: null, zoning: null, newIndex: -1, canUndo: false, canRedo: false };
  }
};

/**
 * Выполняет переход к следующему состоянию (redo)
 */
export const redoAction = (): { plan: FloorPlan | null, zoning: ZoningResult | null, newIndex: number, canUndo: boolean, canRedo: boolean } => {
  try {
    const { history, currentIndex } = getHistory();
    
    if (currentIndex >= history.length - 1 || history.length === 0) {
      console.warn('Нет доступных состояний для повтора. Индекс:', currentIndex, 'Длина истории:', history.length);
      return { 
        plan: null, 
        zoning: null, 
        newIndex: currentIndex,
        canUndo: currentIndex > 0, 
        canRedo: false 
      };
    }
    
    const newIndex = currentIndex + 1;
    const nextState = history[newIndex];
    
    console.log('Выполнен повтор действия. Новый индекс:', newIndex);
    console.log('Следующее состояние:', nextState);
    
    localStorage.setItem(STORAGE_KEYS.HISTORY_INDEX, newIndex.toString());
    
    saveActivePlan(nextState.floorPlan, nextState.zoningResult);
    
    // Уведомляем об изменении состояния истории
    notifyHistoryStateChanged();
    
    return {
      plan: nextState.floorPlan,
      zoning: nextState.zoningResult,
      newIndex,
      canUndo: true,
      canRedo: newIndex < history.length - 1
    };
  } catch (error) {
    console.error('Ошибка при повторе действия:', error);
    return { plan: null, zoning: null, newIndex: -1, canUndo: false, canRedo: false };
  }
};

/**
 * Очищает историю
 */
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    localStorage.removeItem(STORAGE_KEYS.HISTORY_INDEX);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_PLAN);
    
    notifyHistoryStateChanged();
  } catch (error) {
    console.error('Ошибка при очистке истории:', error);
  }
};

/**
 * Проверяет возможность выполнения undo/redo
 */
export const canUndoRedo = (): { canUndo: boolean, canRedo: boolean } => {
  try {
    const { history, currentIndex } = getHistory();
    
    return {
      canUndo: currentIndex > 0,
      canRedo: currentIndex < history.length - 1 && history.length > 0
    };
  } catch (error) {
    console.error('Ошибка при проверке возможности undo/redo:', error);
    return { canUndo: false, canRedo: false };
  }
}; 