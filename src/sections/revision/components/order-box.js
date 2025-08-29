import { useMemo } from 'react';

import {
  Box,
  Stack,
  Input,
  Paper,
  Divider,
  useTheme,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { HOLIDAY_NOTICE, SAMPLE_DOWNLOAD_NOTICE } from 'src/constant/taility';

import NormalButtons from './normal-buttons';
import SampleButtons from './sample-buttons';

// 날짜 포맷 함수 (간단 버전, 실제로는 dayjs 등 사용 권장)
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Space } from 'antd';

dayjs.extend(utc);

function fDateTime(date) {
  if (!date) return '';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
}

const OrderBox = ({ order }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:726px)');

  // 주문자 정보 문자열
  const customerStr = useMemo(
    () =>
      `${order.customer?.name || ''} / ${order.customer?.email || ''} / ${order.orderNumber || ''} ${
        typeof order.orderIndex === 'number' ? `(${order.orderIndex + 1}차)` : ''
      }`,
    [order]
  );

  // 진행상황 안내 메시지
  const processHelp =
    order.grade === '샘플' ? (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-line',
          color: 'black',
          ml: 1,
        }}
      >
        {SAMPLE_DOWNLOAD_NOTICE}
      </Typography>
    ) : order?.process?.includes('진행중') ? (
      <Typography
        variant="body2"
        sx={{
          whiteSpace: 'pre-line',
          color: 'black',
          ml: 1,
        }}
      >
        {HOLIDAY_NOTICE}
      </Typography>
    ) : null;

  // 필드 정보 배열로 리팩토링
  const fields = [
    {
      label: '주문자 성함 / 아이디 / 상품주문번호',
      value: customerStr,
    },
    {
      label: '접수 날짜',
      value: fDateTime(order.createdAt),
    },
    {
      label: '보정등급',
      value: order.grade,
    },
    {
      label: '사진 장수',
      value: order.totalQuantity,
    },
    {
      label: '요청사항',
      value: Array.isArray(order.comments)
        ? order.comments.map((c) => c.comment).join('\n\n')
        : order.comments || '',
    },
    // {
    //   label: '접수파일목록',
    //   value:
    //     order.label === '신규' || order.label === '샘플'
    //       ? Array.isArray(order.workSubmissions)
    //         ? order.workSubmissions
    //             .filter((ws) => ws.type === 'origin' && Array.isArray(ws.files))
    //             .flatMap((ws) => ws.files)
    //             .map((file) => file.originalFileName || file.fileName || file.title || file.id)
    //             .join('\n')
    //         : ''
    //       : order.label === '재수정'
    //         ? Array.isArray(order.workSubmissions)
    //           ? order.workSubmissions
    //               .filter((ws) => ws.type === 'revise' && Array.isArray(ws.files))
    //               .flatMap((ws) => ws.files)
    //               .map((file) => file.originalFileName || file.fileName || file.title || file.id)
    //               .join('\n')
    //           : ''
    //         : '',
    // },
    {
      label: '진행상황',
      value: (() => {
        let str = `${order?.process || '주문접수'}`;
        if (order?.process?.includes('진행중') && order.expiredDate) {
          let extraDays = 0;
          if (order.grade === '씨앗') extraDays = 2;
          else if (order.grade === '새싹') extraDays = 1;

          // Amplify 배포 환경에서 Date 파싱 문제 대응: YYYY-MM-DD는 UTC로 해석되도록 보정
          let baseDate;

          console.log(order.expiredDate);
          if (
            typeof order.expiredDate === 'string' &&
            order.expiredDate.length === 10 &&
            order.expiredDate.match(/^\d{4}-\d{2}-\d{2}$/)
          ) {
            // YYYY-MM-DD 형식이면, UTC 자정으로 명시적으로 파싱 (로컬/서버 환경 차이 방지)
            const [y, m, d] = order.expiredDate.split('-').map(Number);
            baseDate = new Date(Date.UTC(y, m - 1, d));
          } else {
            // 그 외는 기존대로 파싱
            baseDate = new Date(order.expiredDate);
          }
          baseDate.setDate(baseDate.getDate() + extraDays);
          str += ` (${fDateTime(baseDate)})`;
        }
        return str;
      })(),
      help: processHelp,
    },
  ];

  // 폼은 라벨-인풋 가로 정렬, 모바일일 때만 세로 정렬
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
        color: '#222',
        background: '#fff',
        maxWidth: 900,
        width: '100%',
        mx: 'auto',
        mb: 4,
        boxShadow: 'none',
        transition: 'box-shadow 0.2s',
      }}
    >
      <Stack spacing={3}>
        <Stack direction={'row'} alignItems={'flex-end'} gap={2} sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: 'black',
              letterSpacing: 0.5,
              fontSize: { xs: 24, sm: 32 },
              textShadow: '0 1px 2px rgba(0,0,0,0.10)',
              fontWeight: 300,
              margin: '0 0 3px 0',
              fontFamily: 'Baskervville',
            }}
          >
            Date of reception
          </Typography>
          <Typography style={{ marginBottom: 8 }}>접수내역</Typography>
        </Stack>
        <Stack spacing={2} sx={{ mb: 1 }}>
          {fields.map((field, idx) => (
            <Box
              key={field.label}
              sx={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'flex-start',
                mb: 0,
                gap: isMobile ? 0.5 : 2,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight={700}
                gutterBottom
                sx={{
                  color: 'black',
                  fontSize: isMobile ? 14 : 15.5,
                  mt: isMobile ? 0 : 1,
                  mb: isMobile ? 0.5 : 0,
                  letterSpacing: 0.1,
                  minWidth: isMobile ? undefined : 220,
                  flexShrink: 0,
                }}
              >
                {field.label}
              </Typography>
              <Stack direction="column" spacing={field.help ? 1 : 0} sx={{ width: '100%' }}>
                <Input
                  fullWidth
                  value={field.value}
                  readOnly
                  disableUnderline
                  multiline
                  minRows={1}
                  sx={{
                    fontSize: isMobile ? 15 : 17,
                    background: 'none',
                    borderRadius: 0,
                    px: 1.5,
                    py: 0.5,
                    fontWeight: 500,
                    color: '#333',
                    boxShadow: 'none',
                    transition: 'background 0.2s',
                    ml: 0,
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-line',
                    borderBottom: '1px solid black',
                  }}
                  inputProps={{
                    style: {
                      wordBreak: 'break-all',
                      whiteSpace: 'pre-line',
                      overflowWrap: 'break-word',
                    },
                  }}
                />
                {field.help && <Box sx={{ width: '100%' }}>{field.help}</Box>}
              </Stack>
            </Box>
          ))}
        </Stack>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 1,
          }}
        >
          {order.grade === '샘플' ? (
            <SampleButtons order={order} />
          ) : (
            <NormalButtons order={order} />
          )}
        </Box>
      </Stack>
    </Paper>
  );
};

export default OrderBox;
