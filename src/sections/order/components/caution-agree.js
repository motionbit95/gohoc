'use client';

import React from 'react';

import { Box, Checkbox, FormGroup, FormControlLabel } from '@mui/material';

import { sectionContainerStyle } from '../styles/utils';

// "모든 내용에 동의하면 위의 내용을 모두 숙지했습니다를 나타냄" 체크박스 key
const ALL_AGREE_KEY = 'allAgree';

import { OrderCheckbox, OrderAllAgreeCheckbox } from './order-checkbox';

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
    <Box sx={sectionContainerStyle}>
      <Box
        sx={{
          maxWidth: 'md',
          mx: 'auto',
          width: '100%',
          px: { xs: 1, sm: 2, md: 0 },
          py: 4,
          mt: { xs: -21, md: -25 },
          fontSize: { xs: 30, md: 55 },
        }}
      >
        <span
          style={{
            width: '100%',
            maxWidth: '1000px',
            fontFamily: 'Baskervville',
            fontWeight: 400,
            background: 'white',
            padding: 16,
          }}
        >
          CAUTION
        </span>
        <FormGroup sx={{ mt: 4 }}>
          {content.map((item) => (
            <OrderCheckbox
              key={item.key}
              checked={!!checked?.[item.key]}
              onChange={handleChange(item.key)}
              label={
                <span
                  style={{
                    color: '#111',
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
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
            <OrderAllAgreeCheckbox
              checked={!!checked?.[ALL_AGREE_KEY]}
              onChange={handleChange(ALL_AGREE_KEY)}
              label={
                <span
                  style={{
                    color: '#111',
                    fontWeight: 800,
                    fontSize: 'inherit',
                    lineHeight: 2.0,
                  }}
                >
                  위의 내용을 모두 숙지했습니다
                </span>
              }
            />
          </Box>
        </FormGroup>
      </Box>
      <Box sx={{ width: '100%', textAlign: 'center' }}>
        <hr style={{ border: 'none', borderTop: '1.5px solid #111' }} />
      </Box>
    </Box>
  );
}
