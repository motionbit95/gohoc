'use client';

import React from 'react';
import { Box, Typography, TextField, Alert } from '@mui/material';
import { Markdown } from 'src/components/markdown';
import { DEFAULT_TEXTAREA_CONTENT, REQUEST_INSTRUCTIONS } from 'src/constant/ourwedding';
import MarkdownWithCodeFix from './markdown-with-code-fix';

// image-uploader.js 스타일과 유사하게 컬러 및 스타일 적용
const BG_COLOR = '#23291f';
const TEXT_COLOR = '#fffbe9';
const ACCENT_COLOR = '#ffe082';
const ACCENT_COLOR_DARK = '#ffd54f';
const PAPER_BG = '#2e3527';

export default function OrderRequest({ value = '', onChange }) {
  return (
    <Box
      sx={{
        background: BG_COLOR,
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        color: TEXT_COLOR,
        boxShadow: '0 2px 16px 0 rgba(35,41,31,0.08)',
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: ACCENT_COLOR,
          fontWeight: 800,
          letterSpacing: 0.5,
          fontSize: { xs: 20, sm: 22 },
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
        }}
      >
        요청사항
      </Typography>
      <Alert
        severity="info"
        icon={false}
        sx={{
          px: { xs: 2.5, sm: 4, md: 5 },
          py: { xs: 2, sm: 2.5, md: 3 },
          mb: 2,
          fontSize: { xs: 15, sm: 16 },
          wordBreak: 'keep-all',
          background: 'rgba(255,255,255,0.13)',
          color: TEXT_COLOR,
          fontWeight: 600,
          lineHeight: 1.7,
          letterSpacing: 0.1,
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
        }}
      >
        <MarkdownWithCodeFix>{REQUEST_INSTRUCTIONS}</MarkdownWithCodeFix>
      </Alert>
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
            borderRadius: 2,
            fontWeight: 500,
            letterSpacing: 0.5,
            '& .MuiInputBase-input': { color: TEXT_COLOR },
          },
        }}
        InputLabelProps={{
          sx: {
            color: ACCENT_COLOR,
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
