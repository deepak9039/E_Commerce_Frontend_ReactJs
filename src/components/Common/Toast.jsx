import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';

const Toast = ({ open, message, severity = 'success', onClose, duration = 4000, anchorOrigin = { vertical: 'bottom', horizontal: 'center' } }) => {
  const theme = useTheme();

  return (
    <Snackbar open={open} autoHideDuration={duration} onClose={onClose} anchorOrigin={anchorOrigin}>
      <Alert
        onClose={onClose}
        severity={severity}
        sx={{
          width: '100%',
          backgroundColor: theme.palette.primary.main,
          color: '#ffffff',
          '& .MuiAlert-icon': { color: '#ffffff' },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
