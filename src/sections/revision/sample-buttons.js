import { useCallback, useState, useMemo } from 'react';
import { Box, Button, useMediaQuery, CircularProgress } from '@mui/material';
import { BsCaretRightFill } from 'react-icons/bs';
import ImagePreviewModal from 'src/components/upload/components/image-preview-modal';
import { CONFIG } from 'src/global-config';

// 스타일만 취하기: normal-buttons.js의 스타일 구조를 샘플 버튼에 적용

const SampleButtons = ({ order }) => {
  const isMdUp = useMediaQuery('(min-width:726px)');
  const screens = { md: isMdUp };
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
    if (items.length > 0) {
      setShowImage(
        items[0]?.previewUrl || items[0]?.webpUrl || items[0]?.url || items[0]?.s3ViewLink
      );
    }
  }, [isPreviewDisabled, items]);

  // 파일명 유틸
  const getFileName = (fileObj, idx, url) => {
    let filename =
      fileObj.originalFileName || fileObj.fileName || fileObj.title || fileObj.id || `file-${idx}`;
    const urlParts = url.split('.');
    const ext = urlParts.length > 1 ? urlParts[urlParts.length - 1].split(/\#|\?/)[0] : '';
    if (ext && !filename.endsWith(`.${ext}`)) {
      filename += `.${ext}`;
    }
    if (fileObj._originalPrefix) {
      filename = `${filename}`;
    }
    return filename;
  };

  // pad 유틸
  const pad = (n) => n.toString().padStart(2, '0');

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
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        paddingBlock="36px"
        width="100%"
        gap={screens.md ? 4 : 2.5}
      >
        {/* 미리보기 버튼 */}
        <Box
          sx={{
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
            opacity: isPreviewDisabled ? 0.6 : 1,
            cursor: isPreviewDisabled ? 'not-allowed' : 'pointer',
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
            disabled={isPreviewDisabled}
            onClick={handlePreviewAll}
            endIcon={<BsCaretRightFill />}
            fullWidth
          >
            웹에서 미리보기
          </Button>
        </Box>
        {/* 샘플 다운로드 버튼 */}
        <Box
          sx={{
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
            opacity: isSampleDownloadDisabled ? 0.6 : 1,
            cursor: isSampleDownloadDisabled ? 'not-allowed' : 'pointer',
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
            disabled={isSampleDownloadDisabled}
            onClick={() => {
              if (isSampleDownloadDisabled) return;
              const sampleWorkSubmissions =
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
              handleDownloadZip(sampleWorkSubmissions, '샘플', originalFiles);
            }}
            endIcon={
              loading && loadingTarget === '샘플' ? (
                <CircularProgress size={18} color="inherit" sx={{ mr: 1 }} />
              ) : (
                <BsCaretRightFill />
              )
            }
            fullWidth
          >
            샘플 다운로드
          </Button>
        </Box>
      </Box>
      <ImagePreviewModal order={order} showImage={showImage} onClose={handleClose} items={items} />
    </>
  );
};

export default SampleButtons;
