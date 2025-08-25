'use client';

import React from 'react';

import { Box, Checkbox, FormGroup, FormControlLabel } from '@mui/material';

import { COLORS } from 'src/constant/colors';
import { CONFIG } from 'src/global-config';
import { Flex } from 'antd';
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

// Utility to safely render HTML without <div> inside <p>
function SafeHtml({ html, ...props }) {
  // Remove <p> tags and replace with <div> to avoid <div> inside <p> hydration errors
  // Also, if label is just plain text, this is safe
  const safeHtml = html.replace(/<p([\s>])/gi, '<div$1').replace(/<\/p>/gi, '</div>');
  return <span {...props} dangerouslySetInnerHTML={{ __html: safeHtml }} />;
}

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

  // Use Box for Flex and Space to avoid <div> inside <p> hydration errors
  return (
    <Box
      sx={{
        my: 2,
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
        <FormGroup>
          {content.map((item) => (
            <Box
              key={item.key}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{ ...labelSx, mb: 4.0 }}
            >
              <SafeHtml
                html={item.label}
                style={{
                  color: TEXT_COLOR,
                  fontWeight: 300,
                  fontSize: 'inherit',
                  lineHeight: 2.0,
                  fontFamily: 'GumiRomanceTTF',
                  flex: 1,
                  marginRight: 16,
                  wordBreak: 'keep-all',
                }}
              />
              <Checkbox
                checked={!!checked?.[item.key]}
                onChange={handleChange(item.key)}
                sx={checkboxSx}
              />
            </Box>
          ))}
          {/* "위의 내용을 모두 숙지하였습니다." 전체 동의 체크박스 */}
          <Box
            sx={{
              width: '100vw',
              position: 'relative',
              left: '50%',
              right: '50%',
              marginLeft: '-50vw',
              marginRight: '-50vw',
              my: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 48,
              minHeight: 48,
              overflow: 'visible',
              zIndex: 1,
            }}
          >
            {/* 라인 배경 */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                height: 12,
                transform: 'translateY(-50%)',
                backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/line.png)`,
                backgroundRepeat: 'repeat-x',
                backgroundSize: 'auto 12px',
                backgroundPosition: 'center',
                zIndex: 0,
                pointerEvents: 'none',
              }}
            />
            {/* 가운데 라벨+체크박스 */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              sx={{
                ...allAgreeLabelSx,
                background: '#EFFAFF',
                px: 3,
                py: 0.5,
                zIndex: 1,
                position: 'relative',
                mt: 0,
              }}
            >
              <span
                style={{
                  color: '#FC9533',
                  fontWeight: 500,
                  fontSize: 17,
                  lineHeight: 2.0,
                  fontFamily: 'GumiRomanceTTF',
                  marginRight: 16,
                  wordBreak: 'keep-all',
                  letterSpacing: 0.15,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                위의 내용을 모두 숙지하였습니다.
              </span>
              <Checkbox
                checked={!!checked?.[ALL_AGREE_KEY]}
                onChange={handleChange(ALL_AGREE_KEY)}
                sx={checkboxSx}
              />
            </Box>
          </Box>
        </FormGroup>
      </Box>
    </Box>
  );
}
