import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { 
  undoAction, 
  redoAction, 
  canUndoRedo 
} from '../utils/storageUtils';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/strings';
import { FloorPlan, ZoningResult } from '../types';

interface HistoryResult {
  plan: FloorPlan | null;
  zoning: ZoningResult | null;
  newIndex: number;
  canUndo: boolean;
  canRedo: boolean;
}

export const useHistory = (
  onSetSuccessMessage: (message: string | null) => void,
  onSetError: (error: string | null) => void
) => {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  

  const undoMutation = useMutation<HistoryResult>({
    mutationFn: () => Promise.resolve(undoAction()),
    onSuccess: (result) => {
      if (result.plan !== null) {
        onSetSuccessMessage(SUCCESS_MESSAGES.ACTION_UNDONE);
        
        setCanUndo(result.canUndo);
        setCanRedo(result.canRedo);
      }
    },
    onError: (error) => {
      console.error('Ошибка при отмене действия:', error);
      onSetError(ERROR_MESSAGES.UNDO_ERROR);
    }
  });
  
  const redoMutation = useMutation<HistoryResult>({
    mutationFn: () => Promise.resolve(redoAction()),
    onSuccess: (result) => {
      if (result.plan !== null) {
        onSetSuccessMessage(SUCCESS_MESSAGES.ACTION_REDONE);
        
        setCanUndo(result.canUndo);
        setCanRedo(result.canRedo);
      }
    },
    onError: (error) => {
      console.error('Ошибка при повторе действия:', error);
      onSetError(ERROR_MESSAGES.REDO_ERROR);
    }
  });
  
  const updateHistoryState = () => {
    const { canUndo: canUndoVal, canRedo: canRedoVal } = canUndoRedo();
    setCanUndo(canUndoVal);
    setCanRedo(canRedoVal);
  };

  useEffect(() => {
    updateHistoryState();
    
    const handleHistoryStateChange = () => {
      updateHistoryState();
    };
    
    window.addEventListener('historyStateChanged', handleHistoryStateChange);
    
    return () => {
      window.removeEventListener('historyStateChanged', handleHistoryStateChange);
    };
  }, []);
  
  const handleUndo = () => {
    undoMutation.mutate();
  };
  
  const handleRedo = () => {
    redoMutation.mutate();
  };
  
  return {
    canUndo,
    canRedo,
    updateHistoryState,
    handleUndo,
    handleRedo,
    isLoading: undoMutation.isPending || redoMutation.isPending
  };
}; 