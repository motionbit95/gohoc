import { useCallback, useState, useMemo } from 'react';
import { Stack, Button, useMediaQuery, CircularProgress } from '@mui/material';
import { BsCaretRightFill } from 'react-icons/bs';

import { COLORS } from 'src/constant/taility-colors';
import ImagePreviewModal from 'src/components/upload/components/image-preview-modal';

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
      <ImagePreviewModal order={order} showImage={showImage} onClose={handleClose} items={items} />
    </>
  );
};

export default SampleButtons;
