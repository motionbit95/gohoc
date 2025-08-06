import Box from '@mui/material/Box';
import { Carousel, useCarousel, CarouselArrowNumberButtons } from 'src/components/carousel';
import Fade from 'embla-carousel-fade';
import { useEffect, useState, useCallback } from 'react';
import { Skeleton, Typography, Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';
import { Watermark } from 'antd';

function OptimizedImage({ src, alt }) {
  const [loaded, setLoaded] = useState(false);

  // 이미지 클릭 및 우클릭 방지 핸들러
  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <Box position="relative" sx={{ maxHeight: '100vh' }}>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: '100%',
            maxHeight: '100vh',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}

      <Watermark content="Ourwedding">
        <Box
          component="img"
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          sx={{
            width: '100%',
            maxHeight: '100vh',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            // pointerEvents: 'none', // 이 줄을 제거해야 클릭/우클릭 이벤트가 동작함
            userSelect: 'none',
          }}
          onContextMenu={preventDefault}
          onMouseDown={preventDefault}
          onClick={preventDefault}
          draggable={false}
        />
      </Watermark>
    </Box>
  );
}

export function CarouselThumbsY({ order, data }) {
  const carousel = useCarousel(
    {
      thumbs: { axis: 'y', slideSpacing: '8px', slidesToShow: 'auto' },
      duration: 0,
    },
    [Fade()]
  );

  // 스낵바 상태
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  // 다운로드 로딩 상태
  const [downloading, setDownloading] = useState(false);

  // 방향키로 사진 넘기기
  const handleKeyDown = useCallback(
    (e) => {
      if (!carousel || !carousel.slideTo) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        // 다음 슬라이드
        carousel.slideTo(carousel.dots.selectedIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        // 이전 슬라이드
        carousel.slideTo(carousel.dots.selectedIndex - 1);
      }
    },
    [carousel]
  );

  useEffect(() => {
    // 포커스가 모달/캐러셀에 있을 때만 동작하도록 하려면 추가 로직 필요
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Carousel carousel={carousel} sx={{ borderRadius: 2 }}>
        {data.map((item, index) => (
          <Box
            key={item.id}
            sx={{
              position: 'relative',
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
              height: '100vh',
            }}
          >
            <OptimizedImage alt={item.title} src={item.webpUrl} />
          </Box>
        ))}
      </Carousel>

      <CarouselArrowNumberButtons
        {...carousel.arrows}
        options={carousel.options}
        totalSlides={carousel.dots.dotCount}
        selectedIndex={carousel.dots.selectedIndex + 1}
        sx={{ left: 16, bottom: 16, position: 'absolute' }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 9999 }}
        open={downloading}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ ml: 2 }}>다운로드 준비 중입니다...</Typography>
      </Backdrop>
    </Box>
  );
}
