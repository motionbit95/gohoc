import { Button } from '@mui/material';
import { buttonStyle } from '../styles/utils';

export default function OrderButton({ children, variant = 'contained', sx = {}, ...props }) {
  return (
    <Button variant={variant} sx={{ ...buttonStyle(variant), ...sx }} {...props}>
      {children}
    </Button>
  );
}
