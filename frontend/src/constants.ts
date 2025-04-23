export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const API_GENERATE_ZONING = `${API_BASE_URL}${import.meta.env.VITE_API_GENERATE_ZONING || '/generate-zoning'}`;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

export const COLORS = {
  roomStroke: 'black',
  roomFill: 'white',
  textDark: '#333',
  zoneBorderAlpha: 0.5,
};

export const DEFAULT_ROOMS = [
  { id: 1, x: 20, y: 40, width: 100, height: 80 },
  { id: 2, x: 150, y: 40, width: 120, height: 80 }
]; 