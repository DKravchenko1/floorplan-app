import { Snackbar, Alert } from '@mui/material';

interface NotificationsProps {
  successMessage: string | null;
  error: string | null;
  onCloseSuccess: () => void;
}

const Notifications = ({ 
  successMessage, 
  error, 
  onCloseSuccess 
}: NotificationsProps) => {
  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={onCloseSuccess}
        message={successMessage}
      />
    </>
  );
};

export default Notifications; 