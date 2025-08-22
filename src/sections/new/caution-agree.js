'use client';

import React from 'react';

import { Box, Checkbox, FormGroup, FormControlLabel } from '@mui/material';

import { COLORS } from 'src/constant/colors';
import { CAUTION_GUIDE } from 'src/constant/wantswedding';

// 컬러 팔레트 (image-uploader.js와 통일)
const BG_COLOR = COLORS.DETAIL_PAPER_BG;
const TEXT_COLOR = COLORS.DETAIL_TEXT_COLOR;
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;
const ACCENT_COLOR_DARK = COLORS.DETAIL_ACCENT_COLOR_DARK;

// "모든 내용에 동의하면 위의 내용을 모두 숙지했습니다를 나타냄" 체크박스 key
const ALL_AGREE_KEY = 'allAgree';

// 체크박스 스타일 공통화
const checkboxSx = {
  color: ACCENT_COLOR_DARK,
  '&.Mui-checked': {
    color: ACCENT_COLOR_DARK,
  },
  transform: 'scale(1.5)',
  marginRight: 2,
};

// 라벨 스타일 공통화
const labelSx = {
  alignItems: 'flex-start',
  color: TEXT_COLOR,
  '.MuiFormControlLabel-label': {
    fontSize: { xs: 15, sm: 16 },
    fontWeight: 600,
    lineHeight: 1.7,
    letterSpacing: 0.1,
    textShadow: '0 1px 2px rgba(0,0,0,0.10)',
    wordBreak: 'keep-all',
  },
};

const allAgreeLabelSx = {
  alignItems: 'flex-start',
  mt: 2,
  color: ACCENT_COLOR_DARK,
  '.MuiFormControlLabel-label': {
    fontSize: { xs: 16, sm: 17 },
    fontWeight: 800,
    lineHeight: 2.0,
    letterSpacing: 0.15,
    textShadow: '0 1px 2px rgba(0,0,0,0.10)',
    wordBreak: 'keep-all',
  },
};

export default function CautionAgree({ checked = {}, content, onChange }) {
  function getAllChecked(checked) {
    return content.every((item) => !!checked[item.key]);
  }

  // 체크박스 변경 핸들러
  const handleChange = (key) => (e) => {
    const { checked: isChecked } = e.target;
    if (key === ALL_AGREE_KEY) {
      // 전체 동의 체크 시 모든 항목 일괄 변경
      const newChecked = {};
      content.forEach((item) => {
        newChecked[item.key] = isChecked;
      });
      newChecked[ALL_AGREE_KEY] = isChecked;
      onChange?.(newChecked);
    } else {
      // 개별 항목 변경
      const newChecked = {
        ...checked,
        [key]: isChecked,
      };
      // 개별 해제 시 전체 동의도 해제
      if (!isChecked && checked[ALL_AGREE_KEY]) {
        newChecked[ALL_AGREE_KEY] = false;
      }
      // 모든 항목이 체크되면 전체 동의도 체크
      if (getAllChecked({ ...checked, [key]: isChecked })) {
        newChecked[ALL_AGREE_KEY] = true;
      }
      onChange?.(newChecked);
    }
  };

  return (
    <Box
      sx={{
        my: 2,
        background: BG_COLOR,
        p: { xs: 2, sm: 3 },
        color: TEXT_COLOR,
      }}
    >
      <Box
        sx={{
          maxWidth: 'md',
          mx: 'auto',
          width: '100%',
          px: { xs: 1, sm: 2, md: 0 },
          py: 4,
        }}
      >
        <span
          style={{
            width: '100%',
            maxWidth: '1000px',
            color: 'transparent',
            WebkitTextStroke: '0.6px #A79166',
            fontFamily: 'Noto Serif KR, serif',
            fontWeight: 400,
            fontSize: 64,
          }}
        >
          Caution
        </span>
        <FormGroup>
          {content.map((item) => (
            <FormControlLabel
              key={item.key}
              control={
                <Checkbox
                  checked={!!checked?.[item.key]}
                  onChange={handleChange(item.key)}
                  sx={checkboxSx}
                />
              }
              sx={{ ...labelSx, mb: 1.5 }}
              label={
                <span
                  style={{
                    color: TEXT_COLOR,
                    fontWeight: 600,
                    fontSize: 'inherit',
                    lineHeight: 2.0,
                  }}
                  dangerouslySetInnerHTML={{ __html: item.label }}
                />
              }
            />
          ))}
          {/* 모든 내용에 동의하면 위의 내용을 모두 숙지했습니다를 나타냄 */}
          <FormControlLabel
            key={ALL_AGREE_KEY}
            control={
              <Checkbox
                checked={!!checked?.[ALL_AGREE_KEY]}
                //   onChange={handleChange(ALL_AGREE_KEY)}
                sx={checkboxSx}
              />
            }
            sx={allAgreeLabelSx}
            label={
              <span
                style={{
                  color: TEXT_COLOR,
                  fontWeight: 800,
                  fontSize: 'inherit',
                  lineHeight: 2.0,
                }}
              >
                위의 내용을 모두 숙지했습니다
              </span>
            }
          />
        </FormGroup>
      </Box>
    </Box>
  );
}
