import { Box, Typography, Stack, Input, Divider, Paper } from '@mui/material';
import { useTheme, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import NormalButtons from './normal-buttons';
import SampleButtons from './sample-buttons';
import { HOLIDAY_NOTICE, SAMPLE_DOWNLOAD_NOTICE } from 'src/constant/ourwedding';

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
      `${order.customer?.name || ''} / ${order.customer?.id || ''} / ${order.orderNumber || ''} ${
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
      label: '진행상황',
      value: `${order?.process || '주문접수'}${
        order?.process?.includes('진행중') && order.expiredDate
          ? ` (${fDateTime(order.expiredDate)})`
          : ''
      }`,
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
