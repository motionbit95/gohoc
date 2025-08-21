'use client';

import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { COLORS } from 'src/constant/taility-colors';
import { ORDER_LIST_CAUTION } from 'src/constant/taility';

function OrderListCaution() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        mt: 10,
        borderBlock: '1px solid black',
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
          <Box
            sx={{
              display: 'inline-block',
              bgcolor: 'white',
              px: 2,
              py: 1,
              width: 'fit-content',
              maxWidth: '100%',
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              sx={{
                fontFamily: 'Baskervville',
                color: 'black',
                fontWeight: 700,
                fontSize: { xs: 30, md: 55 },
                mt: { xs: -9, md: -11 },
                lineHeight: 1.1,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                bgcolor: 'white',
                px: 1,
              }}
            >
              CAUTION
            </Typography>
          </Box>
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
