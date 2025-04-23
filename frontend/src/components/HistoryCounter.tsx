import React from 'react';
import { Box, Chip } from '@mui/material';
import { HistoryOutlined } from '@mui/icons-material';

interface HistoryCounterProps {
  currentIndex: number;
  totalSteps: number;
}

const HistoryCounter: React.FC<HistoryCounterProps> = ({ currentIndex, totalSteps }) => {
  if (totalSteps === 0) {
    return null;
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" my={1}>
      <Chip
        icon={<HistoryOutlined />}
        label={`Шаг ${currentIndex + 1} из ${totalSteps}`}
        variant="outlined"
        color="primary"
      />
    </Box>
  );
};

export default HistoryCounter; 