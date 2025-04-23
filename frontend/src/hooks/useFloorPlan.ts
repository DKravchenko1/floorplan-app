import React, { useState, useEffect, useCallback } from 'react';
import { FloorPlan, ZoningResult } from '../types';
import { DEFAULT_ROOMS } from '../constants';
import { 
  saveActivePlan, 
  getActivePlan, 
  saveToHistory
} from '../utils/storageUtils';
import { useApiQueries } from './useApiQueries';
import { useFileUpload } from './useFileUpload';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/strings';

/**
 * Хук для управления состоянием плана помещения и зонирования
 */
export const useFloorPlan = () => {
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [zoningResult, setZoningResult] = useState<ZoningResult | null>(null);
  const [shouldDisplayPlan, setShouldDisplayPlan] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  /**
   * Обработчик успешной загрузки файла
   */
  const handleFileUploadSuccess = useCallback((data: FloorPlan) => {
    console.log('Успешно загружен JSON файл:', data);
    setFloorPlan(data);
    setZoningResult(null);
    setShouldDisplayPlan(false);
    saveActivePlan(data, null);
    setError(null);
    setSuccessMessage(SUCCESS_MESSAGES.PLAN_LOADED(data.rooms.length));
  }, []);
  
  /**
   * Обработчик ошибки загрузки файла
   */
  const handleFileUploadError = useCallback((error: Error) => {
    console.error('Ошибка при загрузке файла:', error);
    setError(error.message);
  }, []);
  
  /**
   * Обработчик успешной генерации зонирования
   */
  const handleZoningSuccess = useCallback((result: ZoningResult) => {
    console.log('Получены данные зонирования от API:', result);
    setZoningResult(result);
    setShouldDisplayPlan(true);
    
    if (floorPlan) {
      saveActivePlan(floorPlan, result);
      saveToHistory(floorPlan, result);
    }
    
    setSuccessMessage(SUCCESS_MESSAGES.ZONING_GENERATED(result.zones.length));
  }, [floorPlan]);
  
  /**
   * Обработчик ошибки генерации зонирования
   */
  const handleZoningError = useCallback((error: Error) => {
    console.error('Ошибка при запросе к API:', error);
    setError(ERROR_MESSAGES.GENERATE_ZONING_ERROR);
  }, []);
  
  const { generateZoningMutation } = useApiQueries({
    onZoningSuccess: handleZoningSuccess,
    onZoningError: handleZoningError
  });
  
  const { uploadFileMutation } = useFileUpload({
    onFileUploadSuccess: handleFileUploadSuccess,
    onFileUploadError: handleFileUploadError
  });
  
  const isLoading = generateZoningMutation.isPending || uploadFileMutation.isPending;
  
  /**
   * Загрузка сохраненного состояния при инициализации
   */
  useEffect(() => {
    try {
      const { plan, zoning } = getActivePlan();
      if (plan) {
        setFloorPlan(plan);
        
        if (zoning) {
          setZoningResult(zoning);
          setShouldDisplayPlan(true);
        } else {
          setZoningResult(null);
          setShouldDisplayPlan(false);
        }
        
        console.log('Загружен план из локального хранилища:', plan);
        console.log('Загружено зонирование из локального хранилища:', zoning);
      }
    } catch (error) {
      console.error(ERROR_MESSAGES.STORAGE_ERROR, error);
    }
  }, []);
  
  /**
   * Обработчик события изменения истории (для undo/redo)
   */
  useEffect(() => {
    const handleHistoryStateChange = () => {
      const { plan, zoning } = getActivePlan();
      console.log('Обработка изменения истории:', { plan, zoning });
      
      if (plan) {
        setFloorPlan(plan);
        
        if (zoning && zoning.zones && zoning.zones.length > 0) {
          setZoningResult(zoning);
          setShouldDisplayPlan(true);
          console.log('История: установлен план с зонированием', { zoning });
        } else {
          setZoningResult(null);
          setShouldDisplayPlan(false);
          console.log('История: установлен план без зонирования');
        }
      } else {
        setFloorPlan(null);
        setZoningResult(null);
        setShouldDisplayPlan(false);
        console.log('История: плана нет, сброс состояния');
      }
    };
    
    window.addEventListener('historyStateChanged', handleHistoryStateChange);
    
    return () => {
      window.removeEventListener('historyStateChanged', handleHistoryStateChange);
    };
  }, []);

  /**
   * Обработчик события выбора файла
   */
  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFileMutation.mutate(file);
    }
  }, [uploadFileMutation]);
  
  /**
   * Обработчик генерации зонирования
   */
  const handleGenerateZoning = useCallback(() => {
    if (!floorPlan) {
      setError(ERROR_MESSAGES.NO_FLOOR_PLAN);
      return;
    }
    
    setError(null);
    console.log('Запуск генерации зонирования с планом:', floorPlan);
    generateZoningMutation.mutate(floorPlan);
  }, [floorPlan, generateZoningMutation]);

  /**
   * Обработчик сохранения примера JSON
   */
  const handleSaveExampleJson = useCallback(() => {
    const exampleJson = JSON.stringify({
      rooms: DEFAULT_ROOMS
    }, null, 2);
    
    const blob = new Blob([exampleJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'input_plan.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setSuccessMessage(SUCCESS_MESSAGES.EXAMPLE_DOWNLOADED);
  }, []);

  /**
   * Обработчик закрытия уведомления
   */
  const handleCloseSuccess = useCallback(() => {
    setSuccessMessage(null);
  }, []);

  return {
    floorPlan,
    zoningResult,
    shouldDisplayPlan,
    isLoading,
    error,
    successMessage,
    handleFileInputChange,
    handleGenerateZoning,
    handleSaveExampleJson,
    handleCloseSuccess
  };
}; 