import { Box } from '@mui/material';
import { dividerContainerStyle, dividerStyle } from '../styles/utils';

export default function LogoDivider({ logoSrc, logoAlt = 'Logo', sx = {} }) {
  return (
    <Box sx={dividerContainerStyle}>
      {/* 구분선 */}
      <Box sx={{ ...dividerStyle, ...sx }} />

      {/* 로고 이미지 - HTML img 태그 직접 사용 */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <img
          src={logoSrc}
          alt={logoAlt}
          style={{
            display: 'block',
            width: 'auto',
            height: 'auto',
            maxWidth: '80%',
            maxHeight: '80%',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  );
}
