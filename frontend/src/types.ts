export interface Room {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FloorPlan {
  rooms: Room[];
}

export interface Zone {
  roomId: number;
  zone: string;
}

export interface ZoningResult {
  zones: Zone[];
} 