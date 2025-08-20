'use client';

import React from 'react';

import { Box, Alert, TextField, Typography, Stack, Divider } from '@mui/material';

import { COLORS } from 'src/constant/colors';
import { REQUEST_INSTRUCTIONS } from 'src/constant/ourwedding';

import MarkdownWithCodeFix from './markdown-with-code-fix';
import { Markdown } from 'src/components/markdown';

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
      <Alert
        severity="info"
        icon={false}
        sx={{
          px: 0,
          py: 0,
          mb: 2,
          fontSize: { xs: 15, sm: 16 },
          wordBreak: 'keep-all',
          borderRadius: 2,
          background: ACCENT_COLOR,
          color: TEXT_COLOR,
          fontWeight: 600,
          lineHeight: 1.7,
          letterSpacing: 0.1,
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          boxSizing: 'border-box',
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
          <Box
            sx={{
              mt: 2,
              px: 0,
              py: 0,
              borderRadius: 2,
              background: '#fef3d2',
              color: TEXT_COLOR,
              fontWeight: 600,
              lineHeight: 1.7,
              letterSpacing: 0.1,
              textShadow: '0 1px 2px rgba(0,0,0,0.10)',
              width: '100%',
            }}
          >
            <Box
              component="span"
              sx={{
                fontWeight: 800,
                fontSize: 17,
                color: TEXT_COLOR,
                display: 'block',
                px: { xs: 2.5, sm: 4, md: 5 },
                pt: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              [ 하나의 부위당 하나의 요청사항 작성바랍니다 ]
            </Box>

            <br />

            <Box
              sx={{
                fontWeight: 800,
                fontSize: 16,
                color: TEXT_COLOR,
                mt: 1,
                px: { xs: 2.5, sm: 4, md: 5 },
                pb: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 2, sm: 6 }}
                alignItems="stretch"
              >
                <Box>
                  <div>예시 (O)</div>
                  <div>1. 입꼬리 올려주세요.</div>
                  <div>2. 콧볼 줄여주세요.</div>
                  <div>3. 얼굴 줄여주세요.</div>
                </Box>

                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    mx: 3,
                    borderStyle: 'dashed',
                    borderRightWidth: 3,
                  }}
                />

                <Box>
                  <div>예시 (X)</div>
                  <div>1. 입꼬리 올려주시고, 콧볼 줄여주시고 얼굴 줄여주세요.</div>
                </Box>
              </Stack>

              <br />

              <div style={{ fontWeight: 800 }}>
                (2인 기준) 전체 요청사항(10가지) / 개별 요청사항(5가지) 초과 시 추가금 있습니다.
              </div>
            </Box>
          </Box>
        </Box>
      </Alert>
      {/* <Box
        sx={{
          position: 'relative',
          display: 'inline-block',
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: TEXT_COLOR,
            fontWeight: 800,
            letterSpacing: 0.5,
            fontSize: { xs: 20, sm: 22 },
            textShadow: '0 1px 2px rgba(0,0,0,0.10)',
            pb: 0.5,
            position: 'relative',
            zIndex: 1,
          }}
        >
          유의사항 (요청작성 시 필독사항)
        </Typography>
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 4, // 글씨와 겹치게 약간 위로
            height: 16,
            zIndex: 0,
            background: '#FBEDE3',
            borderRadius: 3,
            pointerEvents: 'none',
            filter: 'blur(0.5px)',
            opacity: 0.95,
            fontWeight: 900,
          }}
        />
      </Box>
      <Alert
        severity="info"
        icon={false}
        sx={{
          px: { xs: 2.5, sm: 4, md: 5 },
          py: { xs: 2, sm: 2.5, md: 3 },
          mb: 2,
          fontSize: { xs: 15, sm: 16 },
          wordBreak: 'keep-all',
          borderRadius: 2,
          background: '#FBEDE3',
          color: TEXT_COLOR,
          fontWeight: 600,
          lineHeight: 1.7,
          letterSpacing: 0.1,
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
        }}
      >
        <Box component="span" sx={{ fontWeight: 800, fontSize: 17, color: TEXT_COLOR }}>
          [ 하나의 부위당 하나의 요청사항 작성바랍니다 ]
        </Box>

        <Box sx={{ fontWeight: 800, fontSize: 16, color: TEXT_COLOR, mt: 1 }}>
          <div>(o) 1. 입꼬리 올려주세요.</div>
          <div>2. 콧볼 줄여주세요.</div>
          <div>3. 얼굴 줄여주세요.</div>
          <br />
          <div
            style={{
              fontWeight: 800,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 4,
              padding: '0px 6px',
              display: 'inline-block',
            }}
          >
            (x) 1. 입꼬리 올려주시고, 콧볼 줄여주시고 얼굴 줄여주세요.
          </div>
          <br />
          <br />
          <div style={{ fontWeight: 800 }}>
            (2인 기준) 전체 요청사항(10가지) / 개별 요청사항(5가지) 초과 시 추가금 있습니다.
          </div>
        </Box>
      </Alert> */}
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
