import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { FloorPlan, ZoningResult } from '../types';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../constants';
import { getZoneColor } from '../utils/colorUtils';

interface FloorPlanCanvasProps {
  floorPlan: FloorPlan | null;
  zoningResult: ZoningResult | null;
  shouldDisplayPlan: boolean;
}

const FloorPlanCanvas: React.FC<FloorPlanCanvasProps> = ({ 
  floorPlan, 
  zoningResult,
  shouldDisplayPlan
}) => {
  if (!floorPlan) {
    return (
      <div style={{ width: '100%', height: '400px', border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Загрузите план помещения</p>
      </div>
    );
  }

  if (!shouldDisplayPlan) {
    return (
      <div style={{ width: '100%', height: '400px', border: '1px dashed #ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>План загружен. Нажмите кнопку "Сгенерировать зонирование" для отображения помещений.</p>
      </div>
    );
  }


  const getZoneForRoom = (roomId: number): string | null => {
    if (!zoningResult || !zoningResult.zones) return null;
    const zoneItem = zoningResult.zones.find(z => z.roomId === roomId);
    return zoneItem ? zoneItem.zone : null;
  };

  return (
    <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT} style={{ border: '1px solid #ddd' }}>
      <Layer>
        {floorPlan.rooms.map(room => {
          const zoneName = getZoneForRoom(room.id);
          const zoneColor = zoneName ? getZoneColor(zoneName) : undefined;
          
          return (
            <React.Fragment key={room.id}>
              <Rect
                x={room.x}
                y={room.y}
                width={room.width}
                height={room.height}
                fill={zoneColor || COLORS.roomFill}
                stroke={COLORS.roomStroke}
                strokeWidth={1}
              />
              
              <Text
                x={room.x + 5}
                y={room.y + 5}
                text={`Комната ${room.id}`}
                fontSize={14}
              />
              
              {zoneName && (
                <Text
                  x={room.x + room.width / 2}
                  y={room.y + room.height / 2}
                  text={zoneName}
                  fontSize={16}
                  fontStyle="bold"
                  fill={COLORS.textDark}
                  align="center"
                  width={room.width}
                  offsetX={room.width / 2}
                />
              )}
            </React.Fragment>
          );
        })}
      </Layer>
    </Stage>
  );
};

export default FloorPlanCanvas; 