import { useMutation } from '@tanstack/react-query';
import { FloorPlan, Room } from '../types';
import { ERROR_MESSAGES } from '../constants/strings';

/**
 * Функция для чтения JSON из файла
 */
const readJsonFromFile = (file: File): Promise<FloorPlan> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        
        if (!jsonData.rooms || !Array.isArray(jsonData.rooms)) {
          reject(new Error(ERROR_MESSAGES.JSON_NO_ROOMS));
          return;
        }
        
        const isValidRooms = jsonData.rooms.every((room: Room) => 
          typeof room.id === 'number' && 
          typeof room.x === 'number' && 
          typeof room.y === 'number' && 
          typeof room.width === 'number' && 
          typeof room.height === 'number'
        );
        
        if (!isValidRooms) {
          reject(new Error(ERROR_MESSAGES.JSON_INVALID_STRUCTURE));
          return;
        }
        
        resolve(jsonData);
      } catch (error) {
        console.error('Ошибка при чтении JSON:', error);
        reject(new Error(ERROR_MESSAGES.JSON_PARSE_ERROR));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Ошибка чтения файла'));
    };
    
    reader.readAsText(file);
  });
};

interface UseFileUploadProps {
  onFileUploadSuccess: (floorPlan: FloorPlan) => void;
  onFileUploadError: (error: Error) => void;
}

/**
 * Хук для загрузки файлов с использованием React Query
 */
export const useFileUpload = ({ onFileUploadSuccess, onFileUploadError }: UseFileUploadProps) => {
  const uploadFileMutation = useMutation({
    mutationFn: readJsonFromFile,
    onSuccess: (data) => {
      onFileUploadSuccess(data);
    },
    onError: (error: Error) => {
      onFileUploadError(error);
    }
  });
  
  return {
    uploadFileMutation,
  };
}; 