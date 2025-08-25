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
import axiosInstance from 'src/lib/axios';
import axios from 'axios';
import { CONFIG } from 'src/global-config';

// MUI Flex 대체
const Flex = ({ children, style, ...props }) => (
  <Box display="flex" {...props} style={style}>
    {children}
  </Box>
);

// MUI 스타일 및 유틸 함수
const paths = {
  wantswedding: {
    form: '/revision',
  },
};

// 실제 다운로드 함수 (동적으로 zip 생성)
// 진행률 콜백 추가
async function downloadZipFiles({ worksubmission, label, order, originalFiles = [], onProgress }) {
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

  let completed = 0;
  const total = allFiles.length;

  // 파일 다운로드 및 zip에 추가
  const fetchAndAddToZip = async (fileObj, idx) => {
    try {
      // 각 파일 객체에서 url 추출
      const url = fileObj.s3ViewLink || fileObj.fileUrl;
      if (!url) throw new Error('No file url');

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/s3/presign-from-url`, {
        s3Url: url,
      });
      const presignedUrl = res.data.presignedUrl;

      const response = await fetch(presignedUrl);

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
      // 원본 파일이면 prefix 붙이기 -> 제거
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
      // 콘솔도 남겨둠
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

  // 실제 다운로드 핸들러
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

  // zip 진행률 Dialog 닫기 핸들러
  const handleCloseZipDialog = () => {
    setZipProgress((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      <Dialog open={zipProgress.open} onClose={handleCloseZipDialog} maxWidth="xs" fullWidth>
        <DialogTitle>ZIP 압축 진행 중</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <LinearProgress
              variant="determinate"
              value={zipProgress.percent}
              sx={{ flex: 1, height: 8, borderRadius: 2 }}
            />
            <Typography variant="body2" sx={{ minWidth: 48, textAlign: 'right' }}>
              {zipProgress.percent}%
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {zipProgress.completed}/{zipProgress.total} 파일 처리 중
          </Typography>
          {zipProgress.currentFile && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              현재 파일: {zipProgress.currentFile}
            </Typography>
          )}
          {zipProgress.error && (
            <Typography variant="body2" color="error">
              에러: {zipProgress.error.message || String(zipProgress.error)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          {zipProgress.percent === 100 || zipProgress.completed === zipProgress.total ? (
            <Button onClick={handleCloseZipDialog} color="primary" autoFocus>
              닫기
            </Button>
          ) : (
            <Typography variant="caption" color="text.secondary" sx={{ px: 2 }}>
              압축이 완료될 때까지 기다려주세요...
            </Typography>
          )}
        </DialogActions>
      </Dialog>
      <Flex
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          paddingBlock: '36px',
          width: '100%',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '30px',
            width: screens.md ? '80%' : '100%',
            maxWidth: 400,
            margin: '0 auto',
          }}
        >
          {/* 1차 보정본 다운로드 버튼 */}
          <div
            style={{
              backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/button4.png)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: screens.md ? '250px' : '200px',
              height: screens.md ? '180px' : '150px',
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isFirstDownloadDisabled ? 0.6 : 1,
              cursor: isFirstDownloadDisabled ? 'not-allowed' : 'pointer',
              margin: '0 auto',
            }}
          >
            <Button
              htmlType="submit"
              type="text"
              size="large"
              style={{
                width: 'auto',
                alignSelf: 'center',
                fontWeight: 300,
                fontFamily: 'GumiRomanceTTF',
                whiteSpace: 'pre-line',
                color: '#006C92',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                fontSize: screens.md ? '18px' : '16px',
              }}
              disabled={isFirstDownloadDisabled}
              onClick={() => {
                if (isFirstDownloadDisabled) return;
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
              {loading && loadingTarget === '보정본' ? (
                <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              ) : (
                '신규 다운로드'
              )}
            </Button>
          </div>

          {/* 최근 재수정본 다운로드 버튼 */}
          <div
            style={{
              backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/button4.png)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: screens.md ? '250px' : '200px',
              height: screens.md ? '180px' : '150px',
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isReviseDownloadDisabled ? 0.6 : 1,
              cursor: isReviseDownloadDisabled ? 'not-allowed' : 'pointer',
              margin: '0 auto',
            }}
          >
            <Button
              htmlType="submit"
              type="text"
              size="large"
              style={{
                width: 'auto',
                alignSelf: 'center',
                fontFamily: 'GumiRomanceTTF',
                fontWeight: 300,
                whiteSpace: 'pre-line',
                color: '#006C92',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                fontSize: screens.md ? '18px' : '16px',
              }}
              disabled={isReviseDownloadDisabled}
              onClick={() => {
                if (isReviseDownloadDisabled) return;
                const files =
                  Array.isArray(order.workSubmissions) && order.workSubmissions.length > 0
                    ? order.workSubmissions.filter((ws) => ws.type === 'revwork')
                    : [];
                handleDownloadZip(files, '재수정본');
              }}
            >
              {loading && loadingTarget === '재수정본' ? (
                <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              ) : (
                '재수정 다운로드'
              )}
            </Button>
          </div>

          {/* 재수정 신청 버튼 */}
          <div
            style={{
              backgroundImage: `url(${CONFIG.assetsDir}/assets/wantswedding/button4.png)`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              width: screens.md ? '250px' : '200px',
              height: screens.md ? '180px' : '150px',
              display: 'flex',
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isReapplyDisabled ? 0.6 : 1,
              cursor: isReapplyDisabled ? 'not-allowed' : 'pointer',
              margin: '0 auto',
            }}
          >
            <Button
              htmlType="submit"
              type="text"
              size="large"
              style={{
                width: 'auto',
                alignSelf: 'center',
                fontFamily: 'GumiRomanceTTF',
                fontWeight: 300,
                whiteSpace: 'pre-line',
                color: '#006C92',
                backgroundColor: 'transparent',
                border: 'none',
                boxShadow: 'none',
                fontSize: screens.md ? '18px' : '16px',
              }}
              disabled={isReapplyDisabled}
              onClick={() => {
                if (isReapplyDisabled) return;
                router.push(`${paths.wantswedding.form}/${order.id}`);
              }}
            >
              재수정 신청
            </Button>
          </div>
        </Box>
      </Flex>
    </>
  );
};

export default NormalButtons;
