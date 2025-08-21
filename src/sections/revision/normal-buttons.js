import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BsCaretRightFill } from 'react-icons/bs';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  useMediaQuery,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  Typography,
  DialogActions,
} from '@mui/material';
import axios from 'axios';

// MUI Flex 대체
const Flex = ({ children, style, ...props }) => (
  <Box display="flex" {...props} style={style}>
    {children}
  </Box>
);

// MUI 스타일 및 유틸 함수
const paths = {
  taility: {
    form: '/revision',
  },
};

// 실제 다운로드 함수 (동적으로 zip 생성)
// 진행률 콜백 추가
async function downloadZipFiles({ worksubmission, label, order, originalFiles = [], onProgress }) {
  const workSubmissions = Array.isArray(worksubmission) ? worksubmission : [worksubmission];

  let allFiles = workSubmissions
    .filter(Boolean)
    .flatMap((ws) => (Array.isArray(ws?.files) ? ws.files : []));

  if (Array.isArray(originalFiles) && originalFiles.length > 0) {
    const originalFilesWithPrefix = originalFiles.map((file, idx) => ({
      ...file,
      _originalPrefix: true,
      _originalIndex: idx,
    }));
    allFiles = [...allFiles, ...originalFilesWithPrefix];
  }

  if (!Array.isArray(allFiles) || allFiles.length === 0) return;

  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  let completed = 0;
  const total = allFiles.length;

  const fetchAndAddToZip = async (fileObj, idx) => {
    try {
      const url = fileObj.s3ViewLink || fileObj.fileUrl;
      if (!url) throw new Error('No file url');

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/s3/presign-from-url`, {
        s3Url: url,
      });
      const presignedUrl = res.data.presignedUrl;

      const response = await fetch(presignedUrl);

      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();

      let filename =
        fileObj.originalFileName ||
        fileObj.fileName ||
        fileObj.title ||
        fileObj.id ||
        `file-${idx}`;
      const urlParts = url.split('.');
      const ext = urlParts.length > 1 ? urlParts[urlParts.length - 1].split(/\#|\?/)[0] : '';
      if (ext && !filename.endsWith(`.${ext}`)) {
        filename += `.${ext}`;
      }
      if (fileObj._originalPrefix) {
        filename = `${filename}`;
      }
      zip.file(filename, blob);

      completed += 1;
      if (onProgress) {
        onProgress({
          completed,
          total,
          percent: Math.round((completed / total) * 100),
          currentFile: filename,
          error: null,
        });
      }
      console.log(
        `[ZIP] 진행률: ${completed}/${total} (${Math.round((completed / total) * 100)}%)`
      );
    } catch (err) {
      completed += 1;
      if (onProgress) {
        onProgress({
          completed,
          total,
          percent: Math.round((completed / total) * 100),
          currentFile: fileObj.fileName || fileObj.originalFileName || fileObj.title || fileObj.id,
          error: err,
        });
      }
      console.error('파일 다운로드 실패:', fileObj, err);
      console.log(
        `[ZIP] 진행률: ${completed}/${total} (${Math.round((completed / total) * 100)}%)`
      );
    }
  };

  await Promise.all(allFiles.map((item, idx) => fetchAndAddToZip(item, idx)));

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = url;
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

// 블랙 & 화이트 스타일 리팩토링
const getButtonSx = (disabled) => ({
  borderRadius: 0,
  backgroundColor: !disabled ? '#000' : 'rgba(0,0,0,0.4)',
  color: !disabled ? '#fff' : 'rgba(255,255,255,0.6)',
  border: 'none',
  cursor: !disabled ? 'pointer' : 'not-allowed',
  opacity: !disabled ? 1 : 0.6,
  fontSize: { xs: 15, md: 17 },
  width: '100%',
  fontWeight: 600,
  boxShadow: 'none',
  transition: 'background 0.2s, color 0.2s',
  '&:hover': {
    backgroundColor: !disabled ? '#222' : 'rgba(150,150,150,0.4)',
    color: !disabled ? '#fff' : 'rgba(255,255,255,0.6)',
  },
});

const getDialogSx = {
  background: '#fff',
  color: '#000',
  borderRadius: 2,
};

const getProgressSx = {
  backgroundColor: '#e0e0e0',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#000',
  },
  height: 8,
  borderRadius: 2,
};

const NormalButtons = ({ order }) => {
  const [loading, setLoading] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState('');
  const [zipProgress, setZipProgress] = useState({
    open: false,
    completed: 0,
    total: 0,
    percent: 0,
    currentFile: '',
    error: null,
    label: '',
  });
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:726px)');
  const screens = { md: !isMobile };
  const router = useRouter();

  useEffect(() => {
    console.log(order);
  }, [order]);

  const hasFirstWorkSubmission =
    Array.isArray(order.workSubmissions) && order.workSubmissions.some((ws) => ws.type === 'first');
  const hasRevworkWorkSubmission =
    Array.isArray(order.workSubmissions) &&
    order.workSubmissions.some((ws) => ws.type === 'revwork');
  const isSendStatusPhase =
    (order.step === '작업자현황' || order.step === '전송예약') &&
    order.grade !== '샘플' &&
    (order.label === '재수정' ? hasRevworkWorkSubmission : hasFirstWorkSubmission);

  const isFirstDownloadDisabled = true;
  loading || (order.label !== '재수정' && (!hasFirstWorkSubmission || !order.isClear));
  const isReviseDownloadDisabled = !hasRevworkWorkSubmission || loading || !order.sendStatus;
  const isReapplyDisabled =
    loading ||
    (order.label === '재수정' ? !hasRevworkWorkSubmission : !hasFirstWorkSubmission) ||
    !order.isClear;

  const handleDownloadZip = useCallback(
    async (worksubmission, label, originalFiles = []) => {
      setLoading(true);
      setLoadingTarget(label);
      setZipProgress({
        open: true,
        completed: 0,
        total: 0,
        percent: 0,
        currentFile: '',
        error: null,
        label,
      });
      try {
        await downloadZipFiles({
          worksubmission,
          label,
          order,
          originalFiles,
          onProgress: (progress) => {
            setZipProgress((prev) => ({
              ...prev,
              ...progress,
              open: true,
              label,
            }));
          },
        });
      } catch (e) {
        alert('다운로드 중 오류가 발생했습니다.');
      }
      setLoading(false);
      setLoadingTarget('');
      setZipProgress((prev) => ({
        ...prev,
        open: false,
      }));
    },
    [order]
  );

  const handleCloseZipDialog = () => {
    setZipProgress((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      <Dialog
        open={zipProgress.open}
        onClose={handleCloseZipDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: getDialogSx,
        }}
      >
        <DialogTitle sx={{ color: '#000', fontWeight: 700, background: '#fff' }}>
          ZIP 압축 진행 중
        </DialogTitle>
        <DialogContent sx={{ background: '#fff' }}>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LinearProgress variant="determinate" value={zipProgress.percent} sx={getProgressSx} />
            <Typography variant="body2" sx={{ minWidth: 48, textAlign: 'right', color: '#000' }}>
              {zipProgress.percent}%
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 1, color: '#222' }}>
            {zipProgress.completed}/{zipProgress.total} 파일 처리 중
          </Typography>
          {zipProgress.currentFile && (
            <Typography variant="body2" sx={{ mb: 1, color: '#444' }}>
              현재 파일: {zipProgress.currentFile}
            </Typography>
          )}
          {zipProgress.error && (
            <Typography variant="body2" sx={{ color: '#d32f2f' }}>
              에러: {zipProgress.error.message || String(zipProgress.error)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ background: '#fff' }}>
          {zipProgress.percent === 100 || zipProgress.completed === zipProgress.total ? (
            <Button onClick={handleCloseZipDialog} sx={getButtonSx(false)} autoFocus>
              닫기
            </Button>
          ) : (
            <Typography variant="caption" sx={{ px: 2, color: '#888' }}>
              압축이 완료될 때까지 기다려주세요...
            </Typography>
          )}
        </DialogActions>
      </Dialog>
      <Flex
        style={{
          alignSelf: 'center',
          paddingBlock: '36px',
          width: screens.md ? '80%' : '100%',
          flexDirection: screens.md ? 'row' : 'column',
          gap: '20px',
        }}
      >
        {/* 1차 보정본 다운로드 버튼 (블랙) */}
        <Button
          variant="contained"
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
            const files =
              Array.isArray(order.workSubmissions) && order.workSubmissions.length > 0
                ? order.workSubmissions.filter((ws) => ws.type === 'first')
                : [];
            const originalFiles =
              Array.isArray(order.workSubmissions) && order.workSubmissions.length > 0
                ? order.workSubmissions
                    .filter(
                      (ws) => ws.type === 'order' || ws.type === 'origin' || ws.type === '원본'
                    )
                    .flatMap((ws) => (Array.isArray(ws.files) ? ws.files : []))
                : [];
            handleDownloadZip(files, '보정본', originalFiles);
          }}
        >
          1차 보정본 다운로드
        </Button>

        {/* 최근 재수정본 다운로드 버튼 (화이트) */}
        <Button
          variant="contained"
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
            const files =
              Array.isArray(order.workSubmissions) && order.workSubmissions.length > 0
                ? order.workSubmissions.filter((ws) => ws.type === 'revwork')
                : [];
            handleDownloadZip(files, '재수정본');
          }}
        >
          최근 재수정본 다운로드
        </Button>

        {/* 재수정 신청 버튼 (블랙) */}
        <Button
          variant="contained"
          endIcon={<BsCaretRightFill />}
          disabled={isReapplyDisabled}
          sx={getButtonSx(isReapplyDisabled)}
          onClick={() => {
            router.push(`${paths.taility.form}/${order.id}`);
          }}
        >
          재수정 신청
        </Button>
      </Flex>
    </>
  );
};

export default NormalButtons;
