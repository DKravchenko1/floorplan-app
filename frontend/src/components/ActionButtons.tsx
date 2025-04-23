import { Button, CircularProgress } from '@mui/material';
import { BUTTON_TEXTS } from '../constants/strings';

interface ActionButtonsProps {
  isLoading: boolean;
  hasFloorPlan: boolean;
  onGenerateZoning: () => void;
  onSaveExampleJson: () => void;
}

const ActionButtons = ({ 
  isLoading, 
  hasFloorPlan, 
  onGenerateZoning, 
  onSaveExampleJson 
}: ActionButtonsProps) => {
  return (
    <>
      <Button 
        variant="contained" 
        color="primary"
        onClick={onGenerateZoning}
        disabled={!hasFloorPlan || isLoading}
        fullWidth
      >
        {isLoading ? (
          <>
            <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
            {BUTTON_TEXTS.GENERATING}
          </>
        ) : BUTTON_TEXTS.GENERATE_ZONING}
      </Button>
      
      <Button 
        variant="outlined" 
        onClick={onSaveExampleJson}
        fullWidth
      >
        {BUTTON_TEXTS.DOWNLOAD_EXAMPLE}
      </Button>
    </>
  );
};

export default ActionButtons; 