import useEmblaCarousel from 'embla-carousel-react';
import { useState, useEffect, useCallback } from 'react';

// ----------------------------------------------------------------------

export function useThumbs(mainApi, options) {
  const [thumbsRef, thumbsApi] = useEmblaCarousel({
    containScroll: 'keepSnaps',
    dragFree: true,
    ...options,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onClickThumb = useCallback(
    (index) => {
      if (!mainApi || !thumbsApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbsApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbsApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbsApi.scrollTo(index);
  }, [mainApi, thumbsApi]);

  // 키보드 이벤트 리스너 등록
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!mainApi) return;

      if (e.key === 'ArrowRight') {
        const next = Math.min(
          mainApi.selectedScrollSnap() + 1,
          mainApi.scrollSnapList().length - 1
        );
        mainApi.scrollTo(next);
      }

      if (e.key === 'ArrowLeft') {
        const prev = Math.max(mainApi.selectedScrollSnap() - 1, 0);
        mainApi.scrollTo(prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mainApi]);

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on('select', onSelect);
    mainApi.on('reInit', onSelect);
  }, [mainApi, onSelect]);

  return {
    onClickThumb,
    thumbsRef,
    thumbsApi,
    selectedIndex,
  };
}
