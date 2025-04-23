import { COLORS } from '../constants';

/**
 * Генерирует цвет для зоны на основе ее названия
 * @param zoneName Название зоны
 * @returns Строка с цветом в формате rgba
 */
export const getZoneColor = (zoneName: string): string => {
  let hash = 0;
  for (let i = 0; i < zoneName.length; i++) {
    hash = zoneName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const r = ((hash & 0xFF0000) >> 16) % 128 + 128;
  const g = ((hash & 0x00FF00) >> 8) % 128 + 128;
  const b = (hash & 0x0000FF) % 128 + 128;
  
  return `rgba(${r}, ${g}, ${b}, ${COLORS.zoneBorderAlpha})`;
}; 