import React from 'react';

import Divider from '@mui/material/Divider';
import { useMediaQuery } from '@mui/material';


const OurWeddingDivider = ({ text, isBorder = false }) => {
  const isMobile = useMediaQuery('(max-width:726px)');
  const fontSize = isMobile ? '1.7rem' : '3rem'; // 기존 28/36 → 38/54로 증가

  return (
    <Divider
      textAlign="center"
      sx={{
        color: '#A79166',
        fontFamily: 'Noto Serif KR, serif',
        fontWeight: 400,
        fontSize,
        borderColor: '#A79166',
        py: { xs: 3, sm: 4 }, // paddingBlock 대체
        background: 'transparent',
        '&::before, &::after': {
          borderColor: '#A79166',
        },
      }}
    >
      <span
        style={{
          width: '100%',
          color: isBorder ? 'transparent' : '#A79166',
          WebkitTextStroke: isBorder ? '0.6px #A79166' : 'none',
          fontFamily: 'Noto Serif KR, serif',
          fontWeight: 400,
          fontSize,
        }}
      >
        {text}
      </span>
    </Divider>
  );
};

export default OurWeddingDivider;
