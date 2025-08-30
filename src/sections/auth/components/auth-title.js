import { Box } from '@mui/material';
import { titleContainerStyle, titleTextStyle } from '../styles/utils';

export default function AuthTitle({ children, isMobile = false, sx = {} }) {
  return (
    <Box sx={{ ...titleContainerStyle(isMobile), ...sx }}>
      <Box sx={titleTextStyle(isMobile)}>
        {children}
      </Box>
    </Box>
  );
}
