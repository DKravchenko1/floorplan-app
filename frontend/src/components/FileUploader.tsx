import { Button, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { BUTTON_TEXTS } from '../constants/strings';

interface FileUploaderProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploader = ({ onFileChange }: FileUploaderProps) => {
  const { register } = useForm();

  return (
    <Box>
      <input
        type="file"
        accept=".json"
        id="floor-plan-upload"
        style={{ display: 'none' }}
        {...register('floorPlanFile', {
          onChange: onFileChange
        })}
      />
      <label htmlFor="floor-plan-upload">
        <Button variant="contained" component="span" fullWidth>
          {BUTTON_TEXTS.UPLOAD_PLAN}
        </Button>
      </label>
    </Box>
  );
};

export default FileUploader; 