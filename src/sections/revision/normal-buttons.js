import { useState } from 'react';
import { Box, Button, CircularProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { BsCaretRightFill } from 'react-icons/bs';
import { useRouter } from 'next/navigation';

// MUI Flex 대체
const Flex = ({ children, style, ...props }) => (
  <Box display="flex" {...props} style={style}>
    {children}
  </Box>
);

// MUI 스타일 및 유틸 함수
const paths = {
  ourwedding: {
    form: '/ourwedding/revision',
  },
};

// 더미 다운로드 함수 (실제 구현 필요)
function downloadFolder(order, files, label) {
  alert(`${label} 다운로드: ${Array.isArray(files) ? files.length : 0}개 파일`);
}

const NormalButtons = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:726px)');
  const screens = { md: !isMobile };
  const router = useRouter();

  // 버튼 활성화/비활성화 조건
  const isFirstDownloadDisabled = loading || !order.first || !order.isClear;
  const isReviseDownloadDisabled = !order.revwork || loading || !order.sendStatus;
  const isReapplyDisabled =
    !order.isLatest ||
    loading ||
    (order.label === '재수정' ? !order.revwork : !order.first) ||
    !order.isClear;

  // 버튼 스타일: sample-buttons.js에서 스타일만 가져옴
  const getButtonSx = (disabled) => ({
    backgroundColor: !disabled ? 'rgba(69, 85, 43, 1)' : 'rgba(150,150,150,0.4)',
    color: 'white',
    cursor: !disabled ? 'pointer' : 'not-allowed',
    opacity: !disabled ? 1 : 0.6,
    fontSize: { xs: 15, md: 17 },
    width: '100%',
    '&:hover': {
      backgroundColor: !disabled ? 'rgba(69, 85, 43, 0.85)' : 'rgba(150,150,150,0.4)',
    },
  });

  return (
    <Flex
      style={{
        alignSelf: 'center',
        paddingBlock: '36px',
        width: screens.md ? '80%' : '100%',
        flexDirection: screens.md ? 'row' : 'column',
        gap: '20px',
      }}
    >
      {/* 1차 보정본 다운로드 버튼 */}
      <Button
        variant="contained"
        color="primary"
        endIcon={
          loading && loadingTarget === '보정본' ? (
            <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
          ) : (
            <BsCaretRightFill />
          )
        }
        sx={getButtonSx(isFirstDownloadDisabled)}
        disabled={isFirstDownloadDisabled}
        onClick={() => {
          setLoading(true);
          setLoadingTarget('보정본');
          downloadFolder(order, [...(order.origin || []), ...(order.first || [])], '보정본');
          setTimeout(() => {
            setLoading(false);
            setLoadingTarget('');
          }, 1000);
        }}
      >
        1차 보정본 다운로드
      </Button>

      {/* 최근 재수정본 다운로드 버튼 */}
      <Button
        variant="contained"
        color="primary"
        endIcon={
          loading && loadingTarget === '재수정본' ? (
            <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
          ) : (
            <BsCaretRightFill />
          )
        }
        sx={getButtonSx(isReviseDownloadDisabled)}
        disabled={isReviseDownloadDisabled}
        onClick={() => {
          setLoading(true);
          setLoadingTarget('재수정본');
          downloadFolder(order, [...(order.revise || []), ...(order.revwork || [])], '재수정본');
          setTimeout(() => {
            setLoading(false);
            setLoadingTarget('');
          }, 1000);
        }}
      >
        최근 재수정본 다운로드
      </Button>

      {/* 재수정 신청 버튼 */}
      <Button
        variant="contained"
        color="primary"
        endIcon={<BsCaretRightFill />}
        disabled={isReapplyDisabled}
        sx={getButtonSx(isReapplyDisabled)}
        onClick={() => {
          router.push(`${paths.ourwedding.form}?orderNumber=${order.id}`);
        }}
      >
        재수정 신청
      </Button>
    </Flex>
  );
};

export default NormalButtons;
