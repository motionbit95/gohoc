'use client';

import React, { useState } from 'react';

import {
  Box,
  Stack,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  FormGroup,
  Typography,
  InputLabel,
  FormControl,
  FormControlLabel,
} from '@mui/material';

// 스타일 유틸리티 import
import { unifiedInputStyle } from '../styles/utils';
import { ORDER_COLORS, ORDER_SIZES } from '../styles/constants';

// 컴포넌트 import
import { OrderTextField, OrderSelect } from './order-input-field';
import { OrderCheckbox, OrderAllAgreeCheckbox } from './order-checkbox';

// 등급 옵션
export const GRADE_OPTIONS = [
  { value: '샘플', label: '샘플' },
  { value: '~4일까지', label: '~4일까지' },
  { value: '~48시간안에', label: '~48시간안에' },
  { value: '당일 6시간 안에(3장이상부터)', label: '당일 6시간 안에(3장이상부터)' },
];

// 추가 옵션 목록
export const ADDITIONAL_OPTIONS = [
  { value: '필름 추가', label: '색감작업(필름)', price: 1500 },
  { value: '인원 추가', label: '인원 추가', price: 2000 },
  { value: '합성', label: '합성', price: 2000 },
];

// 재수정 옵션 목록
export const REVISION_OPTIONS = [{ value: '재수정(2주)', label: '재수정(2주)' }];

// 상수 추출
const { TEXT_COLOR, BG_COLOR, ACCENT_COLOR, ACCENT_COLOR_DARK } = ORDER_COLORS;

const { UNIFIED_RADIUS, UNIFIED_HEIGHT } = ORDER_SIZES;

// 스타일 설정
const unifiedInputProps = {
  style: {
    color: TEXT_COLOR,
    height: UNIFIED_HEIGHT - 2,
    padding: '0 14px',
  },
};

const unifiedInputLabelProps = {
  style: {
    color: ACCENT_COLOR,
    fontWeight: 600,
    fontSize: 14,
  },
  sx: {
    color: ACCENT_COLOR,
    fontWeight: 600,
    fontSize: 14,
  },
};

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
    padding: '0 14px',
  },
};

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
      <Stack spacing={3} direction={'column'}>
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
            style: { color: ACCENT_COLOR },
          }}
          sx={unifiedInputSx}
          variant="standard"
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
            style: { color: ACCENT_COLOR },
          }}
          sx={unifiedInputSx}
          variant="standard"
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
          variant="standard"
        />

        <TextField
          label="주문번호"
          name="orderNumber"
          value={value.orderNumber || ''}
          onChange={handleChange}
          required
          fullWidth
          size="small"
          sx={{
            ...unifiedInputSx,
            '& .MuiInput-underline:before': {
              borderBottom: `1px solid #e0e0e0`,
            },
            '& .MuiInput-underline:after': {
              borderBottom: `1px solid ${ACCENT_COLOR}`,
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
              borderBottom: `1px solid ${ACCENT_COLOR}`,
            },
          }}
          InputLabelProps={{
            ...unifiedInputLabelProps,
            shrink: true,
            style: { color: ACCENT_COLOR }, // 라벨 색상 명시적으로 지정
          }}
          placeholder="* 꼭 정확한 상품 주문번호 기재 바랍니다. *"
          variant="standard"
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
          variant="standard"
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
          sx={{
            ...unifiedInputSx,
            '& .MuiInput-underline:before': {
              borderBottom: `1px solid #e0e0e0`,
            },
            '& .MuiInput-underline:after': {
              borderBottom: `1px solid ${ACCENT_COLOR}`,
            },
            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
              borderBottom: `1px solid ${ACCENT_COLOR}`,
            },
          }}
          InputLabelProps={{
            ...unifiedInputLabelProps,
            shrink: true,
            style: { color: ACCENT_COLOR }, // 라벨 색상 명시적으로 지정
          }}
          variant="standard"
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

        <FormControl
          component="fieldset"
          variant="standard"
          sx={{
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
                    onChange={handleRevisionOptionsChange}
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
