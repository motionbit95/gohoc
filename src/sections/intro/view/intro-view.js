'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo, useCallback, useEffect } from 'react';

import { Box, Button, useTheme, Container, useMediaQuery } from '@mui/material';

import { FONTS, COLORS } from 'src/constant/colors';

import { Iconify } from 'src/components/iconify';

import OurWeddingDivider from 'src/sections/new/ourwedding-divier';

// 스타일 상수
// Taility 전용 블랙&화이트 스타일
const BG_COLOR = '#fff'; // 흰색 배경
const TEXT_COLOR = '#111'; // 진한 검정 텍스트
const ACCENT_COLOR = '#fff'; // 버튼: 흰색
const ACCENT_COLOR_DARK = '#fff'; // 버튼 hover: 더 진한 흰색
const FONT_HEADING = 'Pretendard, Noto Sans KR, sans-serif';

const BUTTON_CONFIGS = [
  {
    label: '신규신청',
    page: 'new',
    icon: <Iconify icon="lucide:edit" sx={{ mr: 1 }} />,
  },
  {
    label: '접수내역 (재수정신청)',
    page: 'revision',
    icon: <Iconify icon="si:clipboard-line" sx={{ mr: 1 }} />,
  },
];

function ActionButton({ label, icon, onClick, isMobile }) {
  return (
    <Button
      variant="contained"
      size="large"
      startIcon={icon}
      onClick={onClick}
      sx={{
        background: ACCENT_COLOR,
        color: '#111',
        fontSize: isMobile ? 16 : 20,
        fontFamily: FONT_HEADING,
        borderRadius: 0,
        boxShadow: 'none',
        py: isMobile ? 2.5 : 3.5,
        px: isMobile ? 3 : 6,
        width: '100%',
        maxWidth: isMobile ? 360 : 420,
        minHeight: isMobile ? 64 : 80,
        letterSpacing: 1.2,
        fontWeight: 700,
        borderBottom: '2px solid #111',
        '&:hover': {
          background: ACCENT_COLOR_DARK,
          color: '#111',
          boxShadow: 'none',
        },
        transition: 'background 0.2s',
      }}
    >
      {label}
    </Button>
  );
}

export default function Ourwedding() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  // 여기오면 localstorage 초기화
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  }, []);

  const handleButtonClick = useCallback(
    (page) => {
      router.push(`/login/?target=${page}`);
    },
    [router]
  );

  // useMemo로 버튼 목록 생성 (불필요한 리렌더 방지)
  const buttons = useMemo(
    () =>
      BUTTON_CONFIGS.map(({ label, page, icon }) => (
        <ActionButton
          key={page}
          label={label}
          icon={icon}
          isMobile={isMobile}
          onClick={() => handleButtonClick(page)}
        />
      )),
    [isMobile, handleButtonClick]
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: BG_COLOR,
        color: TEXT_COLOR,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 6,
        gap: 4,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          mt: 0,
        }}
      >
        {buttons}
      </Container>
    </Box>
  );
}
