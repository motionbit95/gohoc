import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsCaretRightFill } from 'react-icons/bs';

import { useTheme } from '@mui/material/styles';
import { Box, Button, useMediaQuery, CircularProgress } from '@mui/material';

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

// 실제 다운로드 함수 (동적으로 zip 생성)
// worksubmission이 배열일 수도 있으니 배열로 처리
async function downloadZipFiles({ worksubmission, label, order, originalFiles = [] }) {
  // worksubmission이 배열이 아니면 배열로 변환
  const workSubmissions = Array.isArray(worksubmission) ? worksubmission : [worksubmission];

  // 모든 files를 합침
  let allFiles = workSubmissions
    .filter(Boolean)
    .flatMap((ws) => (Array.isArray(ws?.files) ? ws.files : []));

  // 원본 파일도 추가 (1차 보정본 다운로드 시)
  if (Array.isArray(originalFiles) && originalFiles.length > 0) {
    // 원본 파일명에 prefix 추가
    const originalFilesWithPrefix = originalFiles.map((file, idx) => ({
      ...file,
      _originalPrefix: true,
      _originalIndex: idx,
    }));
    allFiles = [...allFiles, ...originalFilesWithPrefix];
  }

  if (!Array.isArray(allFiles) || allFiles.length === 0) return;

  // jszip 동적 import
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  // 파일 다운로드 및 zip에 추가
  const fetchAndAddToZip = async (fileObj, idx) => {
    try {
      // 각 파일 객체에서 url 추출
      const url = fileObj.s3ViewLink || fileObj.fileUrl;
      if (!url) throw new Error('No file url');
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();

      // 파일명 결정
      let filename =
        fileObj.originalFileName ||
        fileObj.fileName ||
        fileObj.title ||
        fileObj.id ||
        `file-${idx}`;
      // 확장자 추출
      const urlParts = url.split('.');
      const ext = urlParts.length > 1 ? urlParts[urlParts.length - 1].split(/\#|\?/)[0] : '';
      if (ext && !filename.endsWith(`.${ext}`)) {
        filename += `.${ext}`;
      }
      // 원본 파일이면 prefix 붙이기
      if (fileObj._originalPrefix) {
        filename = `원본_${filename}`;
      }
      zip.file(filename, blob);
    } catch (err) {
      // 실패한 파일은 무시
      console.error('파일 다운로드 실패:', fileObj, err);
    }
  };

  // 모든 파일 병렬 다운로드 및 zip에 추가
  await Promise.all(allFiles.map((item, idx) => fetchAndAddToZip(item, idx)));

  // zip 파일 생성 및 다운로드
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
  // 오늘 날짜/시간을 파일명에 포함
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  const month = pad(now.getMonth() + 1);
  const date = pad(now.getDate());
  const customerName = order?.customer?.name || 'customer';
  const fileName = `${month}${date}_${label}_${customerName}_${allFiles.length}.zip`;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

const NormalButtons = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:726px)');
  const screens = { md: !isMobile };
  const router = useRouter();

  useEffect(() => {
    console.log(order);
  }, [order]);

  // 버튼 활성화/비활성화 조건
  // worksubmission 기준으로 비교
  const hasFirstWorkSubmission =
    Array.isArray(order.workSubmissions) && order.workSubmissions.some((ws) => ws.type === 'first');
  const hasRevworkWorkSubmission =
    Array.isArray(order.workSubmissions) &&
    order.workSubmissions.some((ws) => ws.type === 'revwork');
  const isSendStatusPhase =
    (order.step === '작업자현황' || order.step === '전송예약') &&
    order.grade !== '샘플' &&
    (order.label === '재수정' ? hasRevworkWorkSubmission : hasFirstWorkSubmission);

  const isFirstDownloadDisabled =
    loading || (order.label !== '재수정' && (!hasFirstWorkSubmission || !order.isClear));
  const isReviseDownloadDisabled = !hasRevworkWorkSubmission || loading || !order.sendStatus;
  const isReapplyDisabled =
    loading ||
    (order.label === '재수정' ? !hasRevworkWorkSubmission : !hasFirstWorkSubmission) ||
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

  // 실제 다운로드 핸들러
  const handleDownloadZip = useCallback(
    async (worksubmission, label, originalFiles = []) => {
      setLoading(true);
      setLoadingTarget(label);
      try {
        await downloadZipFiles({ worksubmission, label, order, originalFiles });
      } catch (e) {
        alert('다운로드 중 오류가 발생했습니다.');
      }
      setLoading(false);
      setLoadingTarget('');
    },
    [order]
  );

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
          // workSubmissions에서 type === 'first'만 추출
          const files =
            Array.isArray(order.workSubmissions) && order.workSubmissions.length > 0
              ? order.workSubmissions.filter((ws) => ws.type === 'first')
              : [];
          // 원본 파일 추출: type === 'order' 또는 type === 'origin'
          const originalFiles =
            Array.isArray(order.workSubmissions) && order.workSubmissions.length > 0
              ? order.workSubmissions
                  .filter((ws) => ws.type === 'order' || ws.type === 'origin' || ws.type === '원본')
                  .flatMap((ws) => (Array.isArray(ws.files) ? ws.files : []))
              : [];
          handleDownloadZip(files, '보정본', originalFiles);
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
          // workSubmissions에서 type === 'revwork'만 추출
          const files =
            Array.isArray(order.workSubmissions) && order.workSubmissions.length > 0
              ? order.workSubmissions.filter((ws) => ws.type === 'revwork')
              : [];
          handleDownloadZip(files, '재수정본');
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
          // 이 페이지로 이동함
          router.push(`${paths.ourwedding.form}/${order.id}`);
        }}
      >
        재수정 신청
      </Button>
    </Flex>
  );
};

export default NormalButtons;
