'use client';

import React, { useState, useEffect } from 'react';

import { Box, Stack, Typography } from '@mui/material';

import { COLORS, STYLES } from 'src/constant/taility-colors';

// 스타일 분리
const BG_COLOR = COLORS.DETAIL_BG_COLOR;
const TEXT_COLOR = COLORS.DETAIL_TEXT_COLOR;
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;
const ACCENT_COLOR_DARK = COLORS.DETAIL_ACCENT_COLOR_DARK;

const UNIFIED_RADIUS = STYLES.UNIFIED_RADIUS;
const UNIFIED_HEIGHT = STYLES.UNIFIED_HEIGHT;

// 스타일 오브젝트 분리
const styles = {
  container: {
    color: TEXT_COLOR,
    borderRadius: 3,
    px: { xs: 2, md: 4 },
    py: { xs: 2, md: 3 },
    mx: 'auto',
    mb: 2,
  },
  sectionTitle: {
    mb: 3,
    color: ACCENT_COLOR,
    fontWeight: 800,
    letterSpacing: 0.5,
    fontSize: { xs: 20, sm: 22 },
    textShadow: '0 1px 2px rgba(0,0,0,0.10)',
  },
  row: {
    display: 'flex',
    flexDirection: { xs: 'column', sm: 'row' },
    alignItems: { xs: 'flex-start', sm: 'center' },
    gap: { xs: 0.5, sm: 2 },
    mb: 2,
    width: '100%',
  },
  label: {
    minWidth: { xs: 90, sm: 120 },
    color: ACCENT_COLOR,
    fontWeight: 700,
    fontSize: 16,
    letterSpacing: 0.2,
    mb: { xs: 0.5, sm: 0 },
    flexShrink: 0,
  },
  valueBox: {
    color: TEXT_COLOR,
    background: 'transparent',
    borderRadius: 0,
    fontWeight: 500,
    letterSpacing: 0.5,
    px: 2,
    py: 1,
    minHeight: UNIFIED_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    border: 'none',
    borderBottom: '1px solid #111',
    boxShadow: 'none',
    flex: 1,
    width: '100%',
  },
  valueBoxNoBorder: {
    color: TEXT_COLOR,
    background: 'transparent',
    borderRadius: 0,
    fontWeight: 500,
    letterSpacing: 0.5,
    px: 2,
    py: 1,
    minHeight: UNIFIED_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    fontSize: 16,
    border: 'none',
    boxShadow: 'none',
    flex: 1,
    width: '100%',
  },
  optionPrice: {
    color: ACCENT_COLOR,
    fontWeight: 700,
    fontSize: 14,
    ml: 0.5,
  },
};

export const GRADE_OPTIONS = [
  { value: '샘플', label: '샘플' },
  { value: '~4일까지', label: '~4일까지' },
  { value: '~48시간안에', label: '~48시간안에' },
  { value: '당일 6시간 안에(3장이상부터)', label: '당일 6시간 안에(3장이상부터)' },
];

export const ADDITIONAL_OPTIONS = [
  { value: '필름 추가', label: '색감작업(필름)', price: 1500 },
  { value: '인원 추가', label: '인원 추가', price: 2000 },
  { value: '합성', label: '합성', price: 2000 },
];

export const REVISION_OPTIONS = [{ value: '재수정(2주)', label: '재수정(2주)' }];

function getCurrentDateTimeString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

export default function OrderForm({ value = {}, onChange, userId, userName }) {
  // value: { userName, userId, orderNumber, grade, additionalOptions, revisionOptions }
  // onChange: (newFormData) => void

  // 자동 접수일
  const [autoReceivedDate, setAutoReceivedDate] = useState(getCurrentDateTimeString());

  // 주문자 정보 자동완성 입력값
  const [autoInput, setAutoInput] = useState('');

  // 자동완성 입력 핸들러
  const handleAutoInputChange = (e) => {
    setAutoInput(e.target.value);
  };

  // 자동완성 적용 핸들러
  const handleAutoInputBlur = () => {
    // 예시: "홍길동 / hongid@naver.com / 123456"
    const parts = autoInput.split('/').map((s) => s.trim());
    if (parts.length >= 3) {
      onChange?.({
        ...value,
        userName: parts[0],
        userId: parts[1],
        orderNumber: parts[2],
      });
    }
  };

  // 자동완성 입력이 바뀌면 value에도 반영
  useEffect(() => {
    if (userName && userId && value.orderNumber) {
      setAutoInput(`${userName} / ${userId} / ${value.orderNumber}`);
    }
  }, [userName, userId, value.orderNumber]);

  // 선택된 추가 옵션 라벨+가격 문자열
  const selectedAdditionalOptions =
    (value.additionalOptions || [])
      .map((val) => {
        const opt = ADDITIONAL_OPTIONS.find((o) => o.value === val);
        return opt ? `${opt.label} (+${opt.price.toLocaleString()}원)` : val;
      })
      .join(', ') || '-';

  // 선택된 등급 라벨
  const selectedGradeLabel = GRADE_OPTIONS.find((o) => o.value === value.grade)?.label || '-';

  // 선택된 재수정 옵션 라벨
  const selectedRevisionLabel =
    (value.revisionOptions || [])
      .map((val) => REVISION_OPTIONS.find((o) => o.value === val)?.label)
      .filter(Boolean)
      .join(', ') || '-';

  return (
    <Box sx={styles.container}>
      <Typography variant="h6" sx={styles.sectionTitle}>
        주문자 정보
      </Typography>
      <Stack spacing={1.5}>
        <Box sx={styles.row}>
          <Typography sx={styles.label}>주문자 성함</Typography>
          <Box sx={styles.valueBox}>{userName || '-'}</Box>
        </Box>
        <Box sx={styles.row}>
          <Typography sx={styles.label}>아이디</Typography>
          <Box sx={styles.valueBox}>{userId || '-'}</Box>
        </Box>
        <Box sx={styles.row}>
          <Typography sx={styles.label}>주문번호</Typography>
          <Box sx={styles.valueBox}>{value.orderNumber || '-'}</Box>
        </Box>
        <Box sx={styles.row}>
          <Typography sx={styles.label}>등급</Typography>
          <Box sx={styles.valueBox}>{selectedGradeLabel}</Box>
        </Box>
        <Box sx={styles.row}>
          <Typography sx={styles.label}>추가 옵션</Typography>
          <Box sx={styles.valueBoxNoBorder}>{selectedAdditionalOptions}</Box>
        </Box>
        <Box sx={styles.row}>
          <Typography sx={styles.label}>재수정 옵션</Typography>
          <Box sx={styles.valueBoxNoBorder}>{selectedRevisionLabel}</Box>
        </Box>
      </Stack>
    </Box>
  );
}
