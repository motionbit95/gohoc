import { Button } from '@mui/material';
import { tailityActionButtonStyle } from '../styles/utils';

export default function TailityActionButton({ 
  label, 
  icon, 
  onClick, 
  isMobile = false,
  sx = {},
  ...props 
}) {
  return (
    <Button
      variant="text"
      size="large"
      startIcon={icon}
      onClick={onClick}
      sx={{ ...tailityActionButtonStyle(isMobile), ...sx }}
      {...props}
    >
      {label}
    </Button>
  );
}
