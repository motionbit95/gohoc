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

import { HOLIDAY_NOTICE, SAMPLE_DOWNLOAD_NOTICE } from 'src/constant/ourwedding';

import NormalButtons from './normal-buttons';
import SampleButtons from './sample-buttons';

// 날짜 포맷 함수 (간단 버전, 실제로는 dayjs 등 사용 권장)
function fDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(
    2,
    '0'
  )}`;
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
          color: 'rgba(147, 81, 23, 1)',
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
          color: 'rgba(147, 81, 23, 1)',
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

          // 타임존 변환 없이, expiredDate를 그대로 Date로 파싱해서 extraDays만 더함
          let baseDate;
          if (
            typeof order.expiredDate === 'string' &&
            order.expiredDate.length === 10 &&
            order.expiredDate.match(/^\d{4}-\d{2}-\d{2}$/)
          ) {
            // YYYY-MM-DD 형식이면, 로컬 타임존으로 해석됨
            const [y, m, d] = order.expiredDate.split('-').map(Number);
            baseDate = new Date(y, m - 1, d);
          } else {
            // ISO 8601 등 그 외는 Date가 알아서 파싱 (타임존 변환 없음)
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            mb: 1,
            flexWrap: 'wrap',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(79, 52, 21, 1)',
              fontWeight: 800,
              fontSize: isMobile ? 18 : 24,
              letterSpacing: 0.5,
              mr: 2,
            }}
          >
            주문일시
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: '#6d4c1b',
              fontWeight: 600,
              fontSize: isMobile ? 15 : 18,
              opacity: 0.85,
            }}
          >
            {fDateTime(order.createdAt)}
          </Typography>
        </Box>
        <Divider flexItem sx={{ my: 0 }} />
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
                  color: '#4F3415',
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
                    background: 'rgba(245,245,240,0.7)',
                    borderRadius: 1.5,
                    px: 1.5,
                    py: 0.5,
                    fontWeight: 500,
                    color: '#333',
                    boxShadow: '0 1px 2px 0 rgba(79,52,21,0.04)',
                    transition: 'background 0.2s',
                    ml: 0,
                    wordBreak: 'break-all',
                    whiteSpace: 'pre-line',
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
