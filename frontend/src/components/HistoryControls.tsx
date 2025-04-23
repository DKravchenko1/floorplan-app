import { Button, Box, Tooltip } from '@mui/material';
import { BUTTON_TEXTS, TOOLTIPS } from '../constants/strings';
import HistoryCounter from './HistoryCounter';
import { useHistoryState } from '../hooks/useHistoryState';

interface HistoryControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

const HistoryControls = ({ canUndo, canRedo, onUndo, onRedo }: HistoryControlsProps) => {
  const { currentIndex, totalSteps } = useHistoryState();

  return (
    <>
      <Box display="flex" justifyContent="center" gap={2} mt={1}>
        <Tooltip title={TOOLTIPS.UNDO}>
          <span>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={onUndo}
              disabled={!canUndo}
              sx={{ minWidth: '120px' }}
            >
              {BUTTON_TEXTS.UNDO}
            </Button>
          </span>
        </Tooltip>
        <Tooltip title={TOOLTIPS.REDO}>
          <span>
            <Button 
              variant="outlined" 
              color="secondary"
              onClick={onRedo}
              disabled={!canRedo}
              sx={{ minWidth: '120px' }}
            >
              {BUTTON_TEXTS.REDO}
            </Button>
          </span>
        </Tooltip>
      </Box>
      
      {/* Отображаем счетчик истории */}
      <HistoryCounter currentIndex={currentIndex} totalSteps={totalSteps} />
    </>
  );
};

export default HistoryControls; 