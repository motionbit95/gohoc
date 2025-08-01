'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { COLORS } from 'src/constant/colors';
import { ORDER_LIST_CAUTION } from 'src/constant/ourwedding';


function OrderListCaution() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#DCDECC',
        width: '100%',
      }}
    >
      <Box
        sx={{
          p: 6,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Stack
          spacing={3}
          sx={{
            maxWidth: '1000px',
            width: '100%',
          }}
        >
          <Typography variant="h4" component="h2" sx={{ m: 0, color: '#4F3415', fontWeight: 700 }}>
            안내사항
          </Typography>
          {ORDER_LIST_CAUTION.map(({ text }, index) => (
            <span
              key={index}
              style={{
                color: COLORS.DETAIL_TEXT_COLOR,
                fontWeight: 600,
                fontSize: 'inherit',
                lineHeight: 2.0,
              }}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default OrderListCaution;
