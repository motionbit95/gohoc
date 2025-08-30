import { Button } from '@mui/material';
import { buttonStyle } from '../styles/utils';

export default function AuthButton({
  children,
  type = 'submit',
  variant = 'text',
  size = 'large',
  disabled = false,
  isMobile = false,
  ...props
}) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      disabled={disabled}
      sx={buttonStyle(isMobile)}
      {...props}
    >
      {children}
    </Button>
  );
}
