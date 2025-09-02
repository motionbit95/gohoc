'use client';

import React from 'react';

import { Box, Alert, Typography, Stack } from '@mui/material';

import { COLORS } from 'src/constant/colors';
import { REQUEST_INSTRUCTIONS } from 'src/constant/wantswedding';

import { Space } from 'antd';
import { Flex } from 'antd';
import { Input } from 'antd';

export default function OrderRequest({ value = '', onChange }) {
  // 상세페이지 전용 색상 적용
  const TEXT_COLOR = COLORS.DETAIL_TEXT_COLOR;
  const ACCENT_COLOR_DARK = 'white';
  const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;
  const PAPER_BG = COLORS.DETAIL_ALERT_BG;

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        color: TEXT_COLOR,
      }}
    >
      <Space>
        <Typography
          variant="h3"
          style={{
            margin: '0 0 3px 0',
            color: ACCENT_COLOR,
            fontFamily: 'GumiRomanceTTF',
            fontWeight: 300,
          }}
        >
          Requests fill in
        </Typography>
        <Typography style={{ fontFamily: 'GumiRomanceTTF' }}>요청사항 작성</Typography>
      </Space>
      <Alert
        severity="info"
        icon={false}
        sx={{
          px: 0,
          py: 0,
          mb: 2,
          fontSize: { xs: 15, sm: 16 },
          wordBreak: 'keep-all',
          borderRadius: 2,
          background: 'white',
          color: TEXT_COLOR,
          fontWeight: 300,
          lineHeight: 1.7,
          letterSpacing: 0.1,
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          boxSizing: 'border-box',
          border: '1px solid rgb(192, 235, 255)',
        }}
      >
        <Box
          sx={{
            px: { xs: 2.5, sm: 4, md: 5 },
            py: { xs: 2, sm: 2.5, md: 3 },
            width: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            boxSizing: 'border-box',
          }}
        >
          <Flex vertical gap="40px" style={{ fontFamily: 'GumiRomanceTTF' }}>
            <div>
              안녕하세요~ 아름다운 신랑신부님!
              <br />
              우리 원츠웨딩과 함께해주셔서 정말 고맙습니다. 보정 사항 기재 시 참고사항
              안내드리겠습니다 :)
            </div>

            <Stack direction={'row'} gap={2}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#79D2FF',
                  borderRadius: '20px',
                  marginTop: 2,
                }}
              />
              <div>
                {'방향 구분하는 방법이에요!'}
                <br />
                좌우는 모니터 보는 기준으로 말씀해주시면 됩니다! (사진 속 신랑신부님 기준이 아니라
                모니터를 보시는 분 기준이에요~)
              </div>
            </Stack>

            <Stack direction={'row'} gap={2}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#79D2FF',
                  borderRadius: '20px',
                  marginTop: 2,
                }}
              />
              <div>
                {'주문 외 다른 작업은 따로 결제해주셔야 해요!'}
                <br />
                주문 해주신 상품외에는 다른 상품에 대한 요청사항은 적용되지 않습니다!
                <br />
                그러므로 다른 상품 요청 사항 기재시에는 따로 결제 부탁드리겠습니다!
              </div>
            </Stack>

            <Stack direction={'row'} gap={2}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#79D2FF',
                  borderRadius: '20px',
                  marginTop: 2,
                }}
              />
              <div>
                {'보정 요청사항 기재 시에는 이렇게 해주세요~!'}
                <br />
                요청 사항 작성 시 막연한 표현보다는 구체적으로 말씀해주시면 더욱더 예쁘게 만들어드릴
                수 있답니다!
                <br />
                더 예뻐 보이고 싶다면 → "눈을 키워주세요~"
                <br />
                듬직해보이고 싶으시다면→ "키를 키워주시고 어깨도 넓혀주세요!"
                <br />
                자연스럽게 웃는 모습 원한다면 → "입꼬리를 위로 올려주세요!"
              </div>
            </Stack>

            <Stack direction={'row'} gap={2}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#79D2FF',
                  borderRadius: '20px',
                  marginTop: 2,
                }}
              />
              <div>
                마지막으로 꼭 확인해주세요!
                <br />
                접수 끝난 다음에는 요청사항 추가가 되지 않습니다. 그러므로 요청사항 빠뜨린 부분
                없는지 다시 한 번 확인해주세요!
                <br />
                신랑신부님의 가장 행복한 순간을 더욱더 아름답게 만들어드리겠습니다!
              </div>
            </Stack>
          </Flex>
        </Box>
      </Alert>
      <br />
      <Input.TextArea
        style={{
          backgroundColor: 'white',
          border: '3px solid #94C6FF',
          minHeight: 400,
          fontFamily: 'GumiRomanceTTF',
        }}
        autoSize={false}
        onBlur={(e) => onChange?.(e.target.value)}
        defaultValue={`파일명 - 요청내용`}
      />
    </Box>
  );
}
