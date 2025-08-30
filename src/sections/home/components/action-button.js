import { Button } from '@mui/material';
import { actionButtonStyle } from '../styles/utils';

export default function ActionButton({ 
  label, 
  icon, 
  onClick, 
  isMobile = false,
  variant = 'contained',
  sx = {},
  ...props 
}) {
  return (
    <Button
      variant={variant}
      size="large"
      startIcon={icon}
      onClick={onClick}
      sx={{ ...actionButtonStyle(isMobile), ...sx }}
      {...props}
    >
      {label}
    </Button>
  );
}
