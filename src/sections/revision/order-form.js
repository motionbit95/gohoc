'use client';

import React, { useState, useEffect } from 'react';

import {
  Box,
  Stack,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  Typography,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@mui/material';

import { COLORS, STYLES } from 'src/constant/colors';

const BG_COLOR = COLORS.DETAIL_BG_COLOR;
const TEXT_COLOR = COLORS.DETAIL_TEXT_COLOR;
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;
const ACCENT_COLOR_DARK = COLORS.DETAIL_ACCENT_COLOR_DARK;

const UNIFIED_RADIUS = STYLES.UNIFIED_RADIUS;
const UNIFIED_HEIGHT = STYLES.UNIFIED_HEIGHT;

export const GRADE_OPTIONS = [
  { value: '샘플', label: '샘플' },
  { value: '~4일', label: '~4일 (기본)' },
  { value: '~48시간', label: '~48시간 (추가금 : 1500원)' },
];

export const ADDITIONAL_OPTIONS = [
  { value: '피부', label: '피부', price: 1500 },
  { value: '체형(+얼굴)', label: '체형(+얼굴)', price: 2000 },
  { value: '합성', label: '합성', price: 2000 },
  { value: '색감', label: '색감', price: 2000 },
];

export const REVISION_OPTIONS = [
  { value: '2회 재수정', label: '2회 재수정' },
  { value: '한달 무제한 재수정', label: '한달 무제한 재수정' },
];

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
    height: UNIFIED_HEIGHT - 2,
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
    pointerEvents: 'none',
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

export default function OrderForm({ value = {}, onChange, userId, userName }) {
  // value: { userName, userId, orderNumber, grade, additionalOptions, revisionOptions }
  // onChange: (newFormData) => void

  // 자동 접수일
  const [autoReceivedDate, setAutoReceivedDate] = useState(getCurrentDateTimeString());

  // 주문자 정보는 userName, userId prop 참고
  // 주문번호는 value.orderNumber에서 관리

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
    // userName, userId는 prop에서, orderNumber는 value에서
    if (userName && userId && value.orderNumber) {
      setAutoInput(`${userName} / ${userId} / ${value.orderNumber}`);
    }
  }, [userName, userId, value.orderNumber]);

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

  // 재수정 옵션: 1개만 선택 가능하도록 변경
  const handleRevisionOptionsChange = (e) => {
    const { value: optionValue, checked } = e.target;
    let newOptions;
    if (checked) {
      newOptions = [optionValue]; // Only one can be selected
    } else {
      newOptions = [];
    }
    onChange?.({
      ...value,
      revisionOptions: newOptions,
    });
  };

  // 셀렉트용 핸들러
  const handleChange = (e) => {
    const { name, value: inputValue } = e.target;
    onChange?.({
      ...value,
      [name]: inputValue,
    });
  };

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
        주문자 정보(자동완성)
      </Typography>
      <Stack spacing={2}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: ACCENT_COLOR,
                fontWeight: 700,
                fontSize: 16,
                mb: 0.5,
                letterSpacing: 0.2,
              }}
            >
              주문자 성함
            </Typography>
            <Box
              sx={{
                ...unifiedInputSx,
                px: 2,
                py: 1,
                minHeight: UNIFIED_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                fontSize: 16,
              }}
            >
              {userName || '-'}
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: ACCENT_COLOR,
                fontWeight: 700,
                fontSize: 16,
                mb: 0.5,
                letterSpacing: 0.2,
              }}
            >
              아이디
            </Typography>
            <Box
              sx={{
                ...unifiedInputSx,
                px: 2,
                py: 1,
                minHeight: UNIFIED_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                fontSize: 16,
              }}
            >
              {userId || '-'}
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: ACCENT_COLOR,
                fontWeight: 700,
                fontSize: 16,
                mb: 0.5,
                letterSpacing: 0.2,
              }}
            >
              주문번호
            </Typography>
            <Box
              sx={{
                ...unifiedInputSx,
                px: 2,
                py: 1,
                minHeight: UNIFIED_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                fontSize: 16,
              }}
            >
              {value.orderNumber || '-'}
            </Box>
          </Box>
        </Box>
        <FormControl
          fullWidth
          size="small"
          required
          disabled={true}
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
        {/* 사진 수량 입력란 제거됨 */}
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
                    disabled={true}
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
            재수정
          </Typography>
          <FormGroup row>
            {REVISION_OPTIONS.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={(value.revisionOptions || []).includes(option.value)}
                    // onChange={handleRevisionOptionsChange}
                    disabled={true}
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
                    // // 한 가지만 선택 가능하도록 나머지 옵션은 disable 처리
                    // disabled={
                    //   (value.revisionOptions || []).length > 0 &&
                    //   !(value.revisionOptions || []).includes(option.value)
                    // }
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
