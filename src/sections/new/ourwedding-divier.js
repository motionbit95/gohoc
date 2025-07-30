import React from 'react';
import Divider from '@mui/material/Divider';
import { useTheme, useMediaQuery } from '@mui/material';

const OurWeddingDivider = ({ text, isBorder = false }) => {
  // @file_context_0: 색상, 폰트 등 상수 사용
  const BG_COLOR = '#23291f';
  const TEXT_COLOR = '#fffbe9';
  const ACCENT_COLOR = '#ffe082';
  const ACCENT_COLOR_DARK = '#ffd54f';
  const PAPER_BG = '#2e3527';

  // 글씨 크기 키움
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:991px)');
  const fontSize = isMobile ? 24 : 54; // 기존 28/36 → 38/54로 증가

  return (
    <Divider
      textAlign="center"
      sx={{
        color: ACCENT_COLOR_DARK,
        fontFamily: 'Noto Serif KR, serif',
        fontWeight: 400,
        fontSize: fontSize,
        borderColor: ACCENT_COLOR,
        py: { xs: 3, sm: 4 }, // paddingBlock 대체
        background: 'transparent',
        '&::before, &::after': {
          borderColor: ACCENT_COLOR,
        },
      }}
    >
      <span
        style={{
          width: '100%',
          maxWidth: '1000px',
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
