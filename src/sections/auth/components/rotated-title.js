import { Box } from '@mui/material';
import { leftTitleStyle, rotatedTitleStyle } from '../styles/utils';

export default function RotatedTitle({ children, sx = {} }) {
  return (
    <Box sx={leftTitleStyle}>
      <Box sx={{ ...rotatedTitleStyle, ...sx }}>
        {children}
      </Box>
    </Box>
  );
}
