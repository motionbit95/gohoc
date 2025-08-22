'use client';

import { useRouter } from 'next/navigation';
import React, { useMemo, useCallback, useEffect } from 'react';

import { Box, Button, useTheme, Container, useMediaQuery } from '@mui/material';

import { FONTS, COLORS } from 'src/constant/colors';

import { Iconify } from 'src/components/iconify';

// 스타일 상수
const BG_COLOR = COLORS.BG_COLOR;
const TEXT_COLOR = COLORS.TEXT_COLOR;
const ACCENT_COLOR = COLORS.LOGIN_ACCENT_COLOR; // 인트로 페이지는 로그인과 동일한 컬러 사용
const ACCENT_COLOR_DARK = COLORS.LOGIN_ACCENT_COLOR_DARK;
const FONT_HEADING = FONTS.HEADING;

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
        color: TEXT_COLOR,
        fontSize: isMobile ? 16 : 20,
        fontFamily: FONT_HEADING,
        borderRadius: 2,
        boxShadow: 'none',
        py: isMobile ? 2.5 : 3.5,
        px: isMobile ? 3 : 6,
        width: '100%',
        maxWidth: isMobile ? 360 : 420,
        minHeight: isMobile ? 64 : 80,
        '&:hover': {
          background: ACCENT_COLOR_DARK,
          boxShadow: 'none',
        },
        transition: 'background 0.2s',
      }}
    >
      {label}
    </Button>
  );
}

export default function WantsWedding() {
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
