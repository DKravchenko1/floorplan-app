import axios from 'axios';
import { FloorPlan, Zone, ZoningResult } from '../types';
import { API_GENERATE_ZONING } from '../constants';

/**
 * Генерирует зонирование для плана помещения
 * @param floorPlan План помещения
 * @returns Результат зонирования
 */
export const generateZoning = async (floorPlan: FloorPlan): Promise<ZoningResult> => {
  try {
    console.log('Отправка запроса на генерацию зонирования:', floorPlan);
    console.log('Отправка на URL:', API_GENERATE_ZONING);
    
    const response = await axios.post(API_GENERATE_ZONING, floorPlan);
    
    console.log('Получен ответ от сервера:', response.data);

    if (!response.data || !response.data.zones || !Array.isArray(response.data.zones)) {
      console.error('Некорректная структура ответа API:', response.data);
      throw new Error('Некорректная структура ответа от сервера');
    }
    
    if (response.data.zones.some((zone: ZoningResult) => !('roomId' in zone) || !('zone' in zone))) {
      console.warn('Структура зонирования не соответствует ожидаемой, выполняем преобразование');
      const transformedData: ZoningResult = {
        zones: Array.isArray(response.data.zones) 
          ? response.data.zones.map((item: Zone) => ({
              roomId: item.roomId || 0,
              zone: item.zone || 'Неизвестно'
            }))
          : []
      };
      
      console.log('Преобразованные данные:', transformedData);
      return transformedData;
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка API при генерации зонирования:', error.message);
      if (error.response) {
        console.error('Статус:', error.response.status);
        console.error('Данные:', error.response.data);
      }
    } else {
      console.error('Неизвестная ошибка при генерации зонирования:', error);
    }
    throw error;
  }
}; 