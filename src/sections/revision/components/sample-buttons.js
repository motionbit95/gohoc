import { useCallback, useState, useMemo } from 'react';
import { Stack, Button, useMediaQuery, CircularProgress, Box } from '@mui/material';
import { BsCaretRightFill } from 'react-icons/bs';

import { COLORS } from 'src/constant/taility-colors';
import { Dialog, DialogContent, DialogActions, IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';

// 유틸: 파일명 생성
const getFileName = (fileObj, idx, url) => {
  let filename =
    fileObj.originalFileName || fileObj.fileName || fileObj.title || fileObj.id || `file-${idx}`;
  // 확장자 추출
  const urlParts = url.split('.');
  const ext = urlParts.length > 1 ? urlParts[urlParts.length - 1].split(/\#|\?/)[0] : '';
  if (ext && !filename.endsWith(`.${ext}`)) {
    filename += `.${ext}`;
  }
  // 원본 파일 prefix
  if (fileObj._originalPrefix) {
    filename = `${filename}`;
  }
  return filename;
};

// 유틸: pad
const pad = (n) => n.toString().padStart(2, '0');

// 샘플 버튼 컴포넌트
const SampleButtons = ({ order }) => {
  const isMdUp = useMediaQuery('(min-width:726px)');
  const [loading, setLoading] = useState(false);
  const [loadingTarget, setLoadingTarget] = useState('');
  const [showImage, setShowImage] = useState(null);

  // --- disable 조건 ---
  const hasFirstWorkSubmission = useMemo(
    () =>
      Array.isArray(order?.workSubmissions) &&
      order.workSubmissions.some((ws) => ws.type === 'first'),
    [order]
  );
  const isPreviewDisabled = loading || !order?.sendStatus;
  const isSampleDownloadDisabled = loading || !order?.isClear || !hasFirstWorkSubmission;

  // items: type이 'first'인 workSubmissions의 files flat
  const items = useMemo(() => {
    if (!Array.isArray(order?.workSubmissions)) return [];
    return order.workSubmissions
      .filter((ws) => ws.type === 'first')
      .flatMap((ws) => (Array.isArray(ws.files) ? ws.files : []));
  }, [order]);

  // 미리보기 모달 닫기
  const handleClose = useCallback(() => setShowImage(null), []);

  // 미리보기 버튼 클릭
  const handlePreviewAll = useCallback(() => {
    if (isPreviewDisabled) return;
    console.log(items);
    if (items.length > 0) {
      setShowImage(
        items[0]?.previewUrl ||
          items[0]?.webpUrl ||
          items[0]?.url ||
          items[0]?.s3ViewLink ||
          items[0]?.directViewUrl
      );
    }
  }, [isPreviewDisabled, items]);

  // zip 다운로드
  const downloadZipFiles = useCallback(
    async ({ worksubmission, label, order, originalFiles = [] }) => {
      const workSubmissions = Array.isArray(worksubmission) ? worksubmission : [worksubmission];
      let allFiles = workSubmissions
        .filter(Boolean)
        .flatMap((ws) => (Array.isArray(ws?.files) ? ws.files : []));
      // 원본 파일 추가
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

      // 파일 다운로드 및 zip에 추가
      await Promise.all(
        allFiles.map(async (fileObj, idx) => {
          try {
            const url = fileObj.s3ViewLink || fileObj.fileUrl;
            if (!url) throw new Error('No file url');
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const blob = await response.blob();
            const filename = getFileName(fileObj, idx, url);
            zip.file(filename, blob);
          } catch (err) {
            console.error('파일 다운로드 실패:', fileObj, err);
          }
        })
      );

      // zip 파일 생성 및 다운로드
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      const now = new Date();
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
    },
    []
  );

  // 다운로드 핸들러
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
    [order, downloadZipFiles]
  );

  // 샘플 workSubmissions 추출
  const sampleWorkSubmissions = useMemo(() => {
    if (Array.isArray(order?.workSubmissions) && order.workSubmissions.length > 0) {
      return order.workSubmissions.filter((ws) => ws.type === 'first');
    }
    return [];
  }, [order]);

  return (
    <>
      <Stack
        direction={isMdUp ? 'row' : 'column'}
        spacing={2.5}
        alignItems="center"
        sx={{
          alignSelf: 'center',
          py: 4.5,
          width: isMdUp ? '50%' : '100%',
        }}
      >
        <Button
          variant="contained"
          endIcon={<BsCaretRightFill />}
          disabled={isPreviewDisabled}
          fullWidth
          onClick={handlePreviewAll}
          sx={{
            borderRadius: 0,
            fontSize: { xs: 15, md: 17 },
            backgroundColor: isPreviewDisabled
              ? 'rgba(150,150,150,0.4)'
              : COLORS.DETAIL_ACCENT_COLOR,
            color: COLORS.DETAIL_BG_COLOR,
            fontWeight: 700,
            boxShadow: '0 2px 8px 0 rgba(110,133,87,0.10)',
            opacity: isPreviewDisabled ? 0.6 : 1,
            cursor: isPreviewDisabled ? 'not-allowed' : 'pointer',
            '&:hover': {
              backgroundColor: isPreviewDisabled
                ? 'rgba(150,150,150,0.4)'
                : COLORS.DETAIL_ACCENT_COLOR_DARK,
            },
          }}
        >
          웹에서 미리보기
        </Button>
        <Button
          variant="contained"
          endIcon={
            loading && loadingTarget === '샘플' ? (
              <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
            ) : (
              <BsCaretRightFill />
            )
          }
          fullWidth
          sx={{
            borderRadius: 0,
            backgroundColor: isSampleDownloadDisabled
              ? 'rgba(150,150,150,0.4)'
              : COLORS.DETAIL_ACCENT_COLOR,
            color: COLORS.DETAIL_BG_COLOR,
            cursor: isSampleDownloadDisabled ? 'not-allowed' : 'pointer',
            opacity: isSampleDownloadDisabled ? 0.6 : 1,
            fontSize: { xs: 15, md: 17 },
            fontWeight: 700,
            boxShadow: '0 2px 8px 0 rgba(110,133,87,0.10)',
            '&:hover': {
              backgroundColor: isSampleDownloadDisabled
                ? 'rgba(150,150,150,0.4)'
                : COLORS.DETAIL_ACCENT_COLOR_DARK,
            },
          }}
          onClick={() => handleDownloadZip(sampleWorkSubmissions, '샘플', [])}
          disabled={isSampleDownloadDisabled}
        >
          샘플 다운로드
        </Button>
      </Stack>
      {showImage && (
        <Box
          sx={{
            position: 'fixed',
            zIndex: 1400,
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* 닫기 버튼 */}
          <IconButton
            onClick={handleClose}
            size="large"
            sx={{
              position: 'fixed',
              top: { xs: 16, md: 32 },
              right: { xs: 16, md: 32 },
              color: '#fff',
              zIndex: 1410,
              background: 'rgba(0,0,0,0.3)',
              '&:hover': { background: 'rgba(0,0,0,0.5)' },
            }}
          >
            <Iconify icon="solar:close-circle-bold" width={36} height={36} />
          </IconButton>
          {/* 이미지 및 워터마크 */}
          <Box
            sx={{
              position: 'relative',
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <img
              src={showImage}
              alt="Preview"
              style={{
                maxHeight: '100vh',
                height: '100vh',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
                margin: '0 auto',
                zIndex: 1,
              }}
              draggable={false}
            />
            {/* 워터마크: Tailwind CSS로 45도 반복 */}
            {/* 워터마크: 이미지보다 앞에, 글씨 크기 줄이고 타일 반복 */}
            <Box
              sx={{
                pointerEvents: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 3, // 이미지보다 앞에
                opacity: 0.28, // 더 선명하게 (기존 0.13 -> 0.28)
                backgroundImage: `
                  repeating-linear-gradient(
                    45deg,
                    rgba(255,255,255,0.28) 0,
                    rgba(255,255,255,0.28) 1px,
                    transparent 1px,
                    transparent 60px
                  )
                `,
                overflow: 'hidden',
              }}
            >
              {/* 타일 반복 워터마크 */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  transform: 'rotate(-45deg)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  opacity: 0.38, // 더 선명하게 (기존 0.18 -> 0.38)
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 4,
                }}
              >
                {Array.from({ length: 10 }).map((_, row) =>
                  Array.from({ length: 20 }).map((_, col) => (
                    <Box
                      key={`${row}-${col}`}
                      sx={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: { xs: 18, sm: 24, md: 32, lg: 40 }, // 글씨 크기 줄임
                        textShadow: '2px 2px 8px rgba(0,0,0,0.28)', // 그림자도 더 진하게
                        letterSpacing: 1,
                        lineHeight: 2.2,
                        opacity: 1,
                        px: 2,
                        py: 0.5,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                        userSelect: 'none',
                        pointerEvents: 'none',
                      }}
                    >
                      Taility
                    </Box>
                  ))
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default SampleButtons;
