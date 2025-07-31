'use client';

import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Paper,
} from '@mui/material';

// 색상 상수 import
import { COLORS, STYLES } from 'src/constant/colors';

// 색감 수정: 상세페이지 전용 색상 사용
const BG_COLOR = COLORS.DETAIL_BG_COLOR;
const TEXT_COLOR = COLORS.DETAIL_TEXT_COLOR;
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;
const ACCENT_COLOR_DARK = COLORS.DETAIL_ACCENT_COLOR_DARK;

// 통일된 input 스타일 변수
const UNIFIED_RADIUS = STYLES.UNIFIED_RADIUS;
const UNIFIED_HEIGHT = STYLES.UNIFIED_HEIGHT;

// 등급 옵션
export const GRADE_OPTIONS = [
  { value: '샘플', label: '샘플 (4일 이내)' },
  { value: '씨앗', label: '씨앗 (7일 이내)' },
  { value: '새싹', label: '새싹 (4일 이내)' },
  { value: '나무', label: '나무 (2일 이내)' },
  { value: '숲', label: '숲 (3시간 이내)' },
];

// 추가 옵션 목록
export const ADDITIONAL_OPTIONS = [
  { value: '필름 추가', label: '필름 추가', price: 1500 },
  { value: '인원 추가', label: '인원 추가', price: 2000 },
  { value: '합성', label: '합성', price: 2000 },
];

// 현재 날짜와 시간을 yyyy-MM-dd HH:mm:ss 형식의 문자열로 반환
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

// 통일된 input 스타일
const unifiedInputSx = {
  color: TEXT_COLOR,
  background: BG_COLOR,
  borderRadius: UNIFIED_RADIUS,
  fontWeight: 500,
  letterSpacing: 0.5,
  height: UNIFIED_HEIGHT,
  minHeight: UNIFIED_HEIGHT,
  '& .MuiInputBase-input': {
    color: TEXT_COLOR,
    height: UNIFIED_HEIGHT - 2, // 내부 padding 고려
    minHeight: UNIFIED_HEIGHT - 2,
    boxSizing: 'border-box',
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: UNIFIED_RADIUS,
    minHeight: UNIFIED_HEIGHT,
    height: UNIFIED_HEIGHT,
    '& fieldset': {
      borderRadius: UNIFIED_RADIUS,
    },
    '&.Mui-focused fieldset': {
      borderColor: ACCENT_COLOR,
    },
  },
  '& .MuiInputLabel-root': {
    color: ACCENT_COLOR,
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 16,
    textShadow: '0 1px 2px rgba(0,0,0,0.18)',
    lineHeight: 1.2,
  },
};

const unifiedInputProps = {
  sx: {
    ...unifiedInputSx,
    pointerEvents: 'none', // readOnly용
  },
  readOnly: true,
};

const unifiedInputLabelProps = {
  sx: {
    color: ACCENT_COLOR,
    fontWeight: 700,
    letterSpacing: 0.2,
    fontSize: 16,
    textShadow: '0 1px 2px rgba(0,0,0,0.18)',
    lineHeight: 1.2,
  },
  shrink: true,
};

export default function OrderForm({ value = {}, onChange, userId = '', userName = '' }) {
  // value prop: { orderNumber, grade, photoCount, additionalOptions }
  // onChange: (newFormData) => void

  const [autoReceivedDate] = useState(getCurrentDateTimeString());

  // 체크박스용 핸들러
  const handleAdditionalOptionsChange = (e) => {
    const { value: optionValue, checked } = e.target;
    let newOptions;
    if (checked) {
      newOptions = [...(value.additionalOptions || []), optionValue];
    } else {
      newOptions = (value.additionalOptions || []).filter((opt) => opt !== optionValue);
    }
    onChange?.({
      ...value,
      additionalOptions: newOptions,
    });
  };

  // 셀렉트, 텍스트필드용 핸들러
  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    onChange?.({
      ...value,
      [name]: name === 'photoCount' ? Math.max(1, Number(inputValue)) : inputValue,
    });
  };

  // 라벨이 사라지는 문제 해결: InputLabelProps에 shrink: true를 명시적으로 추가
  // (unifiedInputLabelProps에 이미 shrink: true가 있지만, 혹시 모를 오버라이드 방지 위해 각 필드에 명시적으로 추가)

  return (
    <Box
      sx={{
        color: TEXT_COLOR,
        borderRadius: 3,
        px: { xs: 2, md: 4 },
        py: { xs: 2, md: 3 },
        mx: 'auto',
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: ACCENT_COLOR,
          fontWeight: 800,
          letterSpacing: 0.5,
          fontSize: { xs: 20, sm: 22 },
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
        }}
      >
        주문자 정보(신규)
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="접수일"
          name="receivedDate"
          value={autoReceivedDate}
          fullWidth
          size="small"
          InputProps={unifiedInputProps}
          InputLabelProps={{
            ...unifiedInputLabelProps,
            shrink: true,
            style: { color: ACCENT_COLOR }, // 라벨 색상 명시적으로 지정
          }}
          sx={unifiedInputSx}
        />
        <TextField
          label="고객 ID (이메일)"
          name="userId"
          value={userId}
          fullWidth
          size="small"
          InputProps={unifiedInputProps}
          InputLabelProps={{
            ...unifiedInputLabelProps,
            shrink: true,
            style: { color: ACCENT_COLOR }, // 라벨 색상 명시적으로 지정
          }}
          sx={unifiedInputSx}
        />
        <TextField
          label="고객명"
          name="userName"
          value={userName}
          fullWidth
          size="small"
          InputProps={unifiedInputProps}
          InputLabelProps={{
            ...unifiedInputLabelProps,
            shrink: true,
            style: { color: ACCENT_COLOR }, // 라벨 색상 명시적으로 지정
          }}
          sx={unifiedInputSx}
        />
        <TextField
          label="주문번호"
          name="orderNumber"
          value={value.orderNumber || ''}
          onChange={handleChange}
          required
          fullWidth
          size="small"
          sx={unifiedInputSx}
          InputLabelProps={{
            ...unifiedInputLabelProps,
            shrink: true,
            style: { color: ACCENT_COLOR }, // 라벨 색상 명시적으로 지정
          }}
        />
        <FormControl
          fullWidth
          size="small"
          required
          sx={{
            ...unifiedInputSx,
            '& .MuiSelect-icon': { color: ACCENT_COLOR },
            '& .MuiOutlinedInput-root': {
              borderRadius: UNIFIED_RADIUS,
              minHeight: UNIFIED_HEIGHT,
              height: UNIFIED_HEIGHT,
              '& fieldset': {
                borderRadius: UNIFIED_RADIUS,
              },
            },
            '& .MuiSelect-select': {
              minHeight: UNIFIED_HEIGHT - 2,
              height: UNIFIED_HEIGHT - 2,
              display: 'flex',
              alignItems: 'center',
              color: TEXT_COLOR,
              padding: '0 14px',
            },
          }}
        >
          <InputLabel
            id="grade-label"
            sx={unifiedInputLabelProps.sx}
            shrink
            style={{ color: ACCENT_COLOR }}
          >
            등급
          </InputLabel>
          <Select
            labelId="grade-label"
            label="등급"
            name="grade"
            value={value.grade || ''}
            onChange={handleChange}
            sx={{
              color: TEXT_COLOR,
              background: BG_COLOR,
              borderRadius: UNIFIED_RADIUS,
              fontWeight: 500,
              letterSpacing: 0.5,
              minHeight: UNIFIED_HEIGHT,
              height: UNIFIED_HEIGHT,
              display: 'flex',
              alignItems: 'center',
              '& .MuiSelect-select': {
                color: TEXT_COLOR,
                minHeight: UNIFIED_HEIGHT - 2,
                height: UNIFIED_HEIGHT - 2,
                display: 'flex',
                alignItems: 'center',
                padding: '0 14px',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  background: BG_COLOR,
                  color: TEXT_COLOR,
                  borderRadius: UNIFIED_RADIUS,
                },
              },
            }}
            // shrink 라벨 강제
            inputProps={{ 'aria-label': '등급' }}
          >
            {GRADE_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                value={option.value}
                sx={{
                  color: TEXT_COLOR,
                  background: 'transparent',
                  borderRadius: UNIFIED_RADIUS,
                  minHeight: UNIFIED_HEIGHT - 2,
                  height: UNIFIED_HEIGHT - 2,
                  display: 'flex',
                  alignItems: 'center',
                  '&.Mui-selected': {
                    background: ACCENT_COLOR_DARK,
                    color: BG_COLOR,
                  },
                  '&:hover': {
                    background: ACCENT_COLOR,
                    color: BG_COLOR,
                  },
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="사진 수량"
          name="photoCount"
          value={value.photoCount || ''}
          onChange={handleChange}
          required
          fullWidth
          size="small"
          type="number"
          inputProps={{ min: 1, style: { height: UNIFIED_HEIGHT - 2, padding: '0 14px' } }}
          sx={unifiedInputSx}
          InputLabelProps={{
            ...unifiedInputLabelProps,
            shrink: true,
            style: { color: ACCENT_COLOR }, // 라벨 색상 명시적으로 지정
          }}
        />
        <FormControl
          component="fieldset"
          variant="standard"
          sx={{
            mt: 1,
            px: 1,
            py: 1,
            background: BG_COLOR,
            borderRadius: UNIFIED_RADIUS,
            minHeight: UNIFIED_HEIGHT + 12,
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{
              mb: 0.5,
              color: ACCENT_COLOR,
              fontWeight: 700,
              letterSpacing: 0.5,
              fontSize: 16,
              textShadow: '0 1px 2px rgba(0,0,0,0.18)',
            }}
          >
            추가 옵션
          </Typography>
          <FormGroup row>
            {ADDITIONAL_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={(value.additionalOptions || []).includes(option.value)}
                    onChange={handleAdditionalOptionsChange}
                    value={option.value}
                    sx={{
                      color: ACCENT_COLOR,
                      borderRadius: UNIFIED_RADIUS,
                      width: 28,
                      height: 28,
                      p: 0.5,
                      '&.Mui-checked': {
                        color: ACCENT_COLOR_DARK,
                      },
                    }}
                  />
                }
                label={
                  <Box
                    component="span"
                    sx={{
                      color: TEXT_COLOR,
                      fontWeight: 500,
                      fontSize: 15,
                      letterSpacing: 0.2,
                    }}
                  >
                    {option.label}
                    <Box
                      component="span"
                      sx={{
                        color: ACCENT_COLOR,
                        fontWeight: 700,
                        fontSize: 14,
                        ml: 0.5,
                      }}
                    >
                      (+{option.price.toLocaleString()}원)
                    </Box>
                  </Box>
                }
                sx={{
                  mr: 2,
                  mb: 0.5,
                  borderRadius: UNIFIED_RADIUS,
                  minHeight: UNIFIED_HEIGHT - 8,
                  alignItems: 'center',
                  '& .MuiFormControlLabel-label': {
                    color: TEXT_COLOR,
                  },
                }}
              />
            ))}
          </FormGroup>
        </FormControl>
      </Stack>
    </Box>
  );
}
