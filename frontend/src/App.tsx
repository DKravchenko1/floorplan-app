import { useCallback } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import FloorPlanCanvas from './components/FloorPlanCanvas';
import FileUploader from './components/FileUploader';
import ActionButtons from './components/ActionButtons';
import HistoryControls from './components/HistoryControls';
import Notifications from './components/Notifications';
import { useFloorPlan } from './hooks/useFloorPlan';
import { useHistory } from './hooks/useHistory';
import { HEADERS } from './constants/strings';
import './App.css';

/**
 * Главный компонент приложения
 */
function App() {
  const {
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
  } = useFloorPlan();
  
  const {
    canUndo,
    canRedo,
    handleUndo,
    handleRedo
  } = useHistory(
    (message: string | null) => {
      if (message) handleCloseSuccess();
    },
    () => {}
  );

  const memoizedHandleGenerateZoning = useCallback(handleGenerateZoning, [handleGenerateZoning]);
  const memoizedHandleSaveExampleJson = useCallback(handleSaveExampleJson, [handleSaveExampleJson]);
  const memoizedHandleUndo = useCallback(handleUndo, [handleUndo]);
  const memoizedHandleRedo = useCallback(handleRedo, [handleRedo]);
  const memoizedHandleFileInputChange = useCallback(handleFileInputChange, [handleFileInputChange]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        {HEADERS.MAIN_TITLE}
      </Typography>
      
      <Box mb={4} component={Paper} p={3}>
        <Typography variant="h6" gutterBottom>
          {HEADERS.UPLOAD_SECTION}
        </Typography>
        
        <Box display="flex" flexDirection="column" gap={2}>
          <FileUploader onFileChange={memoizedHandleFileInputChange} />
          
          <ActionButtons 
            isLoading={isLoading}
            hasFloorPlan={!!floorPlan}
            onGenerateZoning={memoizedHandleGenerateZoning}
            onSaveExampleJson={memoizedHandleSaveExampleJson}
          />
          
          <HistoryControls 
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={memoizedHandleUndo}
            onRedo={memoizedHandleRedo}
          />
        </Box>
        
        <Notifications 
          error={error}
          successMessage={successMessage}
          onCloseSuccess={handleCloseSuccess}
        />
      </Box>
      
      <Box mb={4}>
        <Typography variant="h6" gutterBottom>
          {shouldDisplayPlan && zoningResult ? HEADERS.ZONING_CANVAS_TITLE : HEADERS.CANVAS_TITLE}
        </Typography>
        <FloorPlanCanvas 
          floorPlan={floorPlan} 
          zoningResult={zoningResult} 
          shouldDisplayPlan={shouldDisplayPlan}
        />
      </Box>
    </Container>
  );
}

export default App;
