import { useEffect, useRef, useCallback, useState } from 'react';
import { mergeClasses } from 'minimal-shared/utils';
import ReactLightbox from 'yet-another-react-lightbox';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';

import { Iconify } from '../iconify';
import { getPlugins } from './utils';
import { lightboxClasses } from './classes';

// ----------------------------------------------------------------------

export function Lightbox({
  slides,
  disableZoom,
  disableVideo,
  disableTotal,
  disableCaptions,
  disableSlideshow,
  disableThumbnails,
  disableFullscreen,
  onGetCurrentIndex,
  onSelect, // (optional) callback: (selectedIndexes, slides) => void
  onDelete, // (optional) callback: (selectedIndexes, slides) => void
  className,
  ...other
}) {
  const totalItems = slides ? slides.length : 0;
  const lightboxRef = useRef();

  // 선택된 이미지 인덱스 배열 state (정렬된 상태로 유지)
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  // 현재 인덱스 state를 별도로 관리
  const [currentIndex, setCurrentIndex] = useState(0);

  // 이미지 선택/해제 핸들러 (토글)
  const handleToggleSelect = useCallback(
    (index, event) => {
      setSelectedIndexes((prev) => {
        let next;
        if (prev.includes(index)) {
          next = prev.filter((i) => i !== index);
        } else {
          next = [...prev, index];
        }
        next = next.sort((a, b) => a - b);
        if (typeof onSelect === 'function') {
          onSelect(
            next,
            next.map((i) => slides?.[i])
          );
        }
        return next;
      });
    },
    [onSelect, slides]
  );

  // 'q' 키로 현재 이미지 토글 선택, 'a' 키로 전체 선택/해제
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'q' || e.key === 'Q') {
        setSelectedIndexes((prev) => {
          let next;
          if (prev.includes(currentIndex)) {
            next = prev.filter((i) => i !== currentIndex);
          } else {
            next = [...prev, currentIndex];
          }
          next = next.sort((a, b) => a - b);
          if (typeof onSelect === 'function') {
            onSelect(
              next,
              next.map((i) => slides?.[i])
            );
          }
          return next;
        });
      }
      if (e.key === 'a' || e.key === 'A') {
        setSelectedIndexes((prev) => {
          let next;
          if (prev.length === totalItems) {
            next = [];
          } else {
            next = Array.from({ length: totalItems }, (_, i) => i);
          }
          if (typeof onSelect === 'function') {
            onSelect(
              next,
              next.map((i) => slides?.[i])
            );
          }
          return next;
        });
      }
    },
    [onSelect, slides, currentIndex, totalItems]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // 다운로드 핸들러
  const handleDownloadSelected = async () => {
    if (!slides || selectedIndexes.length === 0) return;

    // JSZip 동적 import (필요시 설치: npm install jszip)
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    // 파일 다운로드 및 zip에 추가
    const fetchAndAddToZip = async (slide, idx) => {
      if (!slide?.downloadLink) return;
      try {
        const response = await fetch(slide.downloadLink);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();

        // 파일명 결정: slide.title 또는 slide.id 또는 idx
        let filename = slide.title || slide.id || `file-${idx}`;
        // 확장자 추출
        const urlParts = slide.downloadLink.split('.');
        const ext = urlParts.length > 1 ? urlParts[urlParts.length - 1].split(/\#|\?/)[0] : '';
        if (ext && !filename.endsWith(`.${ext}`)) {
          filename += `.${ext}`;
        }
        zip.file(filename, blob);
      } catch (err) {
        // 실패한 파일은 무시
        console.error('파일 다운로드 실패:', slide, err);
      }
    };

    // 모든 파일을 zip에 추가
    await Promise.all(selectedIndexes.map((idx) => fetchAndAddToZip(slides[idx], idx)));

    // zip 파일 생성 및 다운로드
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    // 오늘 날짜/시간을 파일명에 포함
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const dateStr = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
    a.download = `selected_files_${dateStr}.zip`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  };

  // 삭제 핸들러
  const handleDeleteSelected = () => {
    if (typeof onDelete === 'function' && selectedIndexes.length > 0) {
      onDelete(
        selectedIndexes,
        selectedIndexes.map((i) => slides?.[i])
      );
    }
  };

  // 썸네일 렌더링 함수: slides의 thumbnailUrl 사용
  // index가 안 오므로, 썸네일의 index를 추적할 수 있도록 slides에서 index를 찾아야 함
  function renderThumbnail({ slide, rect, active }) {
    // 썸네일 URL은 slide.thumbnailUrl 또는 slide.thumbnail
    const thumbnailUrl = slide.thumbnailUrl || slide.thumbnail;
    if (!thumbnailUrl) return null;

    // slides에서 현재 slide의 index를 찾음
    const index = slides ? slides.findIndex((s) => s === slide) : -1;

    // 선택된 index에는 체크 표시
    const isSelected = selectedIndexes && selectedIndexes.includes(index);

    // 디버깅용 로그
    // console.log(index, isSelected);

    return (
      <div
        style={{
          position: 'relative',
          width: rect.width,
          height: rect.height,
        }}
      >
        <div style={{ position: 'absolute', margin: '4px' }}>
          <Checkbox
            size="small"
            checked={isSelected}
            sx={{
              p: 0.5,
              borderRadius: '50%',
              boxShadow: 1,
            }}
            inputProps={{ 'aria-label': '썸네일 선택' }}
          />
        </div>
        <img
          src={thumbnailUrl}
          alt={slide.title || `thumbnail-${index}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            border: active ? '2px solid #1976d2' : '2px solid transparent',
            borderRadius: 4,
            boxSizing: 'border-box',
            display: 'block',
          }}
          draggable={false}
        />
      </div>
    );
  }

  // 툴바에 체크박스와 선택된 개수 표시 + 선택시 메뉴
  function DisplayTotalWithSelection({
    totalItems,
    disableTotal,
    selectedIndexes,
    onToggleSelect,
    currentIndex,
  }) {
    if (disableTotal) {
      return null;
    }

    const isChecked = selectedIndexes.includes(currentIndex);

    return (
      <Box
        component="span"
        className="yarl__button"
        sx={{
          typography: 'body2',
          alignItems: 'center',
          display: 'inline-flex',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        <Checkbox
          size="small"
          checked={isChecked}
          onChange={(e) => onToggleSelect(currentIndex, e)}
          sx={{ p: 0.5 }}
          inputProps={{ 'aria-label': '이미지 선택' }}
        />
        <strong>{currentIndex + 1}</strong> / {totalItems}
        <Box
          component="span"
          sx={{
            ml: 1,
            px: 1,
            py: 0.25,
            borderRadius: 1,
            bgcolor: 'primary.lighter',
            color: 'primary.main',
            fontWeight: 600,
            fontSize: 13,
            display: 'inline-block',
          }}
        >
          선택: {selectedIndexes.length}
        </Box>
        {/* 선택된 항목이 있으면 메뉴 버튼 표시 */}
        {selectedIndexes.length > 0 && (
          <>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              sx={{
                ml: 1,
                minWidth: 0,
                px: 1,
                py: 0.25,
                fontSize: 13,
                zIndex: 1301,
                position: 'relative',
              }}
              onClick={handleDownloadSelected}
              startIcon={<Iconify icon="solar:download-bold" width={18} />}
              disabled={selectedIndexes.length === 0}
            >
              다운로드
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              sx={{
                ml: 1,
                minWidth: 0,
                px: 1,
                py: 0.25,
                fontSize: 13,
                zIndex: 1301,
                position: 'relative',
              }}
              onClick={handleDeleteSelected}
              startIcon={<Iconify icon="solar:trash-bin-trash-bold" width={18} />}
              disabled={selectedIndexes.length === 0}
            >
              삭제
            </Button>
          </>
        )}
      </Box>
    );
  }

  return (
    <ReactLightbox
      ref={lightboxRef}
      slides={slides}
      animation={{ swipe: 240 }}
      carousel={{ finite: totalItems < 5 }}
      controller={{ closeOnBackdropClick: true }}
      plugins={getPlugins({
        disableZoom,
        disableVideo,
        disableCaptions,
        disableSlideshow,
        disableThumbnails,
        disableFullscreen,
      })}
      on={{
        view: ({ index }) => {
          setCurrentIndex(index);
          if (onGetCurrentIndex) {
            onGetCurrentIndex(index);
          }
        },
      }}
      toolbar={{
        buttons: [
          <DisplayTotalWithSelection
            key={0}
            totalItems={totalItems}
            disableTotal={disableTotal}
            selectedIndexes={selectedIndexes}
            onToggleSelect={handleToggleSelect}
            currentIndex={currentIndex}
          />,
          'close',
        ],
      }}
      render={{
        iconClose: () => <Iconify width={24} icon="carbon:close" />,
        iconZoomIn: () => <Iconify width={24} icon="carbon:zoom-in" />,
        iconZoomOut: () => <Iconify width={24} icon="carbon:zoom-out" />,
        iconSlideshowPlay: () => <Iconify width={24} icon="carbon:play" />,
        iconSlideshowPause: () => <Iconify width={24} icon="carbon:pause" />,
        iconPrev: () => <Iconify width={32} icon="carbon:chevron-left" />,
        iconNext: () => <Iconify width={32} icon="carbon:chevron-right" />,
        iconExitFullscreen: () => <Iconify width={24} icon="carbon:center-to-fit" />,
        iconEnterFullscreen: () => <Iconify width={24} icon="carbon:fit-to-screen" />,
        // 썸네일 렌더러 추가: slides의 thumbnailUrl 사용
        thumbnail: renderThumbnail,
      }}
      className={mergeClasses([lightboxClasses.root, className])}
      {...other}
    />
  );
}
