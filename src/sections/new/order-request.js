'use client';

import React from 'react';

import { Box, Alert, TextField, Typography, Stack, Divider } from '@mui/material';

import { COLORS } from 'src/constant/taility-colors';
import { REQUEST_INSTRUCTIONS } from 'src/constant/taility';

import MarkdownWithCodeFix from './markdown-with-code-fix';
import { Markdown } from 'src/components/markdown';
import { CONFIG } from 'src/global-config';

export default function OrderRequest({ value = '', onChange }) {
  // 상세페이지 전용 색상 적용
  const TEXT_COLOR = COLORS.DETAIL_TEXT_COLOR;
  const ACCENT_COLOR = 'rgb(220, 222, 204)';
  const ACCENT_COLOR_DARK = COLORS.DETAIL_ACCENT_COLOR_DARK;
  const PAPER_BG = COLORS.DETAIL_ALERT_BG;

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        color: TEXT_COLOR,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: TEXT_COLOR,
          fontWeight: 800,
          letterSpacing: 0.5,
          fontSize: { xs: 20, sm: 22 },
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
        }}
      >
        요청사항
      </Typography>
      <Box
        sx={{
          px: 0,
          py: 0,
          mb: 2,
          fontSize: { xs: 15, sm: 16 },
          wordBreak: 'keep-all',
          borderRadius: 0,
          // background: ACCENT_COLOR,
          backgroundImage: `url(${CONFIG.assetsDir}/assets/taility/bg2.png)`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: '100% 100%', // 강제로 늘리기
          color: TEXT_COLOR,
          lineHeight: 1.0,
          letterSpacing: 0.1,
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          p: 7,
        }}
      >
        <Box
          sx={{
            px: { xs: 2.5, sm: 4, md: 5 },
            py: { xs: 2, sm: 2.5, md: 3 },
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            boxSizing: 'border-box',
          }}
        >
          <MarkdownWithCodeFix>{REQUEST_INSTRUCTIONS}</MarkdownWithCodeFix>
        </Box>
      </Box>
      <br />
      <TextField
        label="요청사항을 입력해 주세요"
        multiline
        minRows={5}
        fullWidth
        defaultValue={value}
        onBlur={(e) => onChange?.(e.target.value)}
        variant="outlined"
        InputProps={{
          sx: {
            color: TEXT_COLOR,
            background: PAPER_BG,
            fontWeight: 500,
            letterSpacing: 0.5,
            p: 4,
            '& .MuiInputBase-input': { color: TEXT_COLOR },
          },
        }}
        InputLabelProps={{
          sx: {
            color: ACCENT_COLOR_DARK,
            fontWeight: 700,
            letterSpacing: 0.2,
            fontSize: 16,
            textShadow: '0 1px 2px rgba(0,0,0,0.18)',
            lineHeight: 1.2,
          },
          shrink: true,
        }}
      />
    </Box>
  );
}
