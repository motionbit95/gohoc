'use client';

import { useRef, useState } from 'react';

import {
  Box,
  Grid,
  Fade,
  Paper,
  Alert,
  Modal,
  Button,
  Backdrop,
  Typography,
  IconButton,
} from '@mui/material';

// 색상 상수 import
import { COLORS } from 'src/constant/colors';

import { Image } from 'src/components/image';
import { Iconify } from 'src/components/iconify';

import MarkdownWithCodeFix from './markdown-with-code-fix';

// 컬러 팔레트 (조화롭게 변경)
const BG_COLOR = 'white';
const TEXT_COLOR = COLORS.DETAIL_TEXT_COLOR;
const ACCENT_COLOR_DARK = 'rgb(220, 222, 204)';
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR;
const PAPER_BG = COLORS.DETAIL_ALERT_BG;

// maxCount prop: undefined/null이면 무제한 허용
export default function ImageUploader({ onChange, title, alert, maxCount = 0 }) {
  const [images, setImages] = useState([]); // [{file, url}]
  const [error, setError] = useState(null); // 업로드 제한 에러 메시지
  const fileInputRef = useRef(null);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);

  // maxCount가 undefined, null, Infinity, 0 이하 등일 때 무제한으로 간주
  const isUnlimited = !maxCount || maxCount === Infinity || maxCount <= 0;

  const handleFileChange = (e) => {
    setError(null);
    const files = Array.from(e.target.files);

    if (!isUnlimited) {
      // 현재 업로드된 이미지 수 + 새로 선택한 파일 수가 maxCount를 넘는지 체크
      if (images.length + files.length > maxCount) {
        setError(`최대 ${maxCount}장까지 업로드할 수 있습니다.`);
        // 일부만 추가하는 로직: 남은 개수만큼만 추가
        const remain = maxCount - images.length;
        if (remain <= 0) {
          e.target.value = '';
          return;
        }
        files.splice(remain); // 남은 개수만큼만 남김
      }
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => {
          const updated = [...prev, { file, url: reader.result }];
          if (onChange) onChange(updated.map((img) => img.file));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    // reset input value so same file can be uploaded again if needed
    e.target.value = '';
  };

  const handleButtonClick = () => {
    setError(null);
    fileInputRef.current.click();
  };

  const handleRemove = (idx) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== idx);
      if (onChange) onChange(updated.map((img) => img.file));
      return updated;
    });
    // 만약 삭제한 이미지가 라이트박스에서 열려있던 이미지라면 닫기
    if (lightboxOpen && lightboxIdx === idx) {
      setLightboxOpen(false);
    }
    setError(null);
  };

  const handleImageClick = (idx) => {
    setLightboxIdx(idx);
    setLightboxOpen(true);
  };

  const handleLightboxClose = () => {
    setLightboxOpen(false);
  };

  const handleLightboxPrev = (e) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleLightboxNext = (e) => {
    e.stopPropagation();
    setLightboxIdx((prev) => (prev + 1) % images.length);
  };

  return (
    <Box
      sx={{
        borderRadius: 3,
        p: { xs: 2, sm: 3 },
        color: TEXT_COLOR,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          color: TEXT_COLOR,
          fontWeight: 800,
          letterSpacing: 0.5,
          fontSize: { xs: 20, sm: 22 },
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
        }}
      >
        {title}
      </Typography>
      {/* Alert 메시지는 부모에서 props로 전달받아 마크다운으로 Alert에 표시 */}
      {alert && (
        <Alert
          severity="info"
          icon={false}
          sx={{
            px: { xs: 2.5, sm: 4, md: 5 },
            py: { xs: 2, sm: 2.5, md: 3 },
            mb: 2,
            fontSize: { xs: 15, sm: 16 },
            wordBreak: 'keep-all',
            background: ACCENT_COLOR_DARK,
            color: TEXT_COLOR,
            // border: `1.5px solid ${ACCENT_COLOR}`, // border 제거
            fontWeight: 600,
            lineHeight: 1.7,
            letterSpacing: 0.1,
            textShadow: '0 1px 2px rgba(0,0,0,0.10)',
          }}
        >
          <MarkdownWithCodeFix>{alert}</MarkdownWithCodeFix>
        </Alert>
      )}
      {/* 업로드 제한 에러 메시지 */}
      {error && (
        <Alert
          severity="warning"
          icon={false}
          sx={{
            mb: 2,
            fontSize: { xs: 15, sm: 16 },
            background: 'rgba(255,224,130,0.13)',
            color: ACCENT_COLOR,
            fontWeight: 700,
            lineHeight: 1.7,
            letterSpacing: 0.1,
            textShadow: '0 1px 2px rgba(0,0,0,0.10)',
          }}
        >
          {error}
        </Alert>
      )}
      <Box
        sx={{
          mb: 1,
          fontSize: 16,
          color: ACCENT_COLOR,
          textAlign: 'right',
          fontWeight: 600,
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
        }}
      >
        현재 업로드: <b style={{ color: TEXT_COLOR, fontWeight: 800 }}>{images.length}</b>장
      </Box>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
        disabled={!isUnlimited && images.length >= maxCount}
      />
      <Button
        variant="contained"
        onClick={handleButtonClick}
        sx={{
          mb: 2,
          background: ACCENT_COLOR,
          color: BG_COLOR,
          fontWeight: 800,
          fontSize: 16,
          letterSpacing: 0.5,
          textShadow: '0 1px 2px rgba(0,0,0,0.10)',
          '&:hover': {
            background: ACCENT_COLOR_DARK,
          },
          boxShadow: '0 2px 8px 0 rgba(255,224,130,0.15)',
        }}
        disabled={isUnlimited && images.length >= maxCount}
      >
        {isUnlimited ? '이미지 업로드(사진 수량를 입력하세요)' : '이미지 업로드'}
      </Button>
      <Box
        sx={{
          mt: 2,
          maxHeight: { xs: 320, sm: 400, md: 480 }, // 예시: 반응형 최대 높이
          overflowY: 'auto',
          pr: 1, // 스크롤바 공간 확보
          // 예쁜 스크롤바 스타일
          scrollbarWidth: 'thin',
          scrollbarColor: `${ACCENT_COLOR} ${PAPER_BG}`,
          '&::-webkit-scrollbar': {
            width: 8,
            background: PAPER_BG,
            borderRadius: 8,
          },
          '&::-webkit-scrollbar-thumb': {
            background: ACCENT_COLOR,
            borderRadius: 8,
            minHeight: 24,
            border: `2px solid ${PAPER_BG}`,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: ACCENT_COLOR_DARK,
          },
          '&::-webkit-scrollbar-corner': {
            background: PAPER_BG,
          },
        }}
      >
        <Grid container spacing={2}>
          {images.map((img, idx) => (
            <Grid
              item
              xs={4}
              sm={4}
              md={3}
              lg={2.4}
              key={idx}
              sx={{
                flexBasis: {
                  xs: 'calc(33.333% - 16px)',
                  sm: 'calc(33.333% - 16px)',
                  md: 'calc(25% - 16px)',
                  lg: 'calc(20% - 16px)',
                },
                maxWidth: {
                  xs: 'calc(33.333% - 16px)',
                  sm: 'calc(33.333% - 16px)',
                  md: 'calc(25% - 16px)',
                  lg: 'calc(20% - 16px)',
                },
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  background: PAPER_BG,
                  aspectRatio: '1 / 1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 6px 0 rgba(35,41,31,0.10)',
                  cursor: 'pointer',
                }}
                onClick={() => handleImageClick(idx)}
              >
                {/* MUI Image 컴포넌트 사용 (빠른 로딩 및 fallback 지원) */}
                <Image
                  src={img.thumbUrl || img.url}
                  alt={`업로드 이미지 ${idx + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    aspectRatio: '1 / 1',
                    filter: 'brightness(1.05) contrast(1.08)',
                    background: '#fffbe9',
                    boxSizing: 'border-box',
                    pointerEvents: 'none',
                    userSelect: 'none',
                    imageRendering: 'auto',
                  }}
                  draggable={false}
                  loading="lazy"
                  ref={(el) => {
                    // 동적으로 썸네일 생성 (최초 1회만)
                    if (!el || img.thumbUrl) return;
                    // 이미 thumbUrl이 있으면 skip
                    const makeThumbnail = () => {
                      const image = new window.Image();
                      image.onload = () => {
                        const MAX_SIZE = 320;
                        let { width, height } = image;
                        let scale = 1;
                        if (width > height && width > MAX_SIZE) scale = MAX_SIZE / width;
                        else if (height > width && height > MAX_SIZE) scale = MAX_SIZE / height;
                        else if (width === height && width > MAX_SIZE) scale = MAX_SIZE / width;
                        width = Math.round(width * scale);
                        height = Math.round(height * scale);
                        const canvas = document.createElement('canvas');
                        canvas.width = width;
                        canvas.height = height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(image, 0, 0, width, height);
                        // 화질 낮추기 위해 quality 0.3~0.5로
                        const thumbUrl = canvas.toDataURL('image/jpeg', 0.35);
                        // img 객체에 thumbUrl 저장 (불변성 깨지만, 썸네일 용도라 허용)
                        img.thumbUrl = thumbUrl;
                        // 강제 리렌더 (setImages 등 없으므로, el.src를 직접 갱신)
                        el.src = thumbUrl;
                      };
                      image.src = img.url;
                    };
                    makeThumbnail();
                  }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  sx={{
                    position: 'absolute',
                    top: { xs: 4, sm: 6 },
                    right: { xs: 4, sm: 6 },
                    background: '#fffbe9',
                    color: '#d32f2f',
                    '&:hover': {
                      background: '#ffe082',
                      color: '#b71c1c',
                    },
                    transition: 'background 0.18s, color 0.18s',
                    zIndex: 2,
                    width: { xs: 28, sm: 32 },
                    height: { xs: 28, sm: 32 },
                    p: 0,
                  }}
                  aria-label="이미지 삭제"
                  title="이미지 삭제"
                >
                  <Iconify icon="solar:close-circle-bold" width={20} height={20} />
                </IconButton>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      {/* Lightbox Modal */}
      <Modal
        open={lightboxOpen}
        onClose={handleLightboxClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 200,
            sx: {
              background: 'rgba(35,41,31,0.70)', // dimm 효과 적용
              backdropFilter: 'none', // 블러 제거
            },
          },
        }}
        aria-labelledby="lightbox-modal"
        aria-describedby="lightbox-modal-desc"
      >
        <Fade in={lightboxOpen}>
          <Box
            onClick={handleLightboxClose}
            sx={{
              outline: 'none',
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'fixed',
              top: 0,
              left: 0,
              zIndex: 1300,
              cursor: 'zoom-out',
              userSelect: 'none',
              background: 'transparent', // 배경 투명
              p: 0,
              m: 0,
            }}
          >
            {images.length > 0 && (
              <Box
                sx={{
                  position: 'relative',
                  width: '100vw',
                  height: '100vh',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent', // 배경 투명
                  borderRadius: 0,
                  boxShadow: 'none',
                  p: 0,
                  m: 0,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Prev Button */}
                {images.length > 1 && (
                  <IconButton
                    onClick={handleLightboxPrev}
                    sx={{
                      position: 'absolute',
                      left: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.25)',
                      color: '#fffbe9',
                      zIndex: 2,
                      '&:hover': {
                        background: 'rgba(0,0,0,0.45)',
                      },
                    }}
                    aria-label="이전 이미지"
                  >
                    <Iconify icon="solar:arrow-left-bold" width={32} height={32} />
                  </IconButton>
                )}
                {/* Image */}
                <Box
                  component="img"
                  src={images[lightboxIdx]?.url}
                  alt={`업로드 이미지 ${lightboxIdx + 1}`}
                  sx={{
                    width: '100vw',
                    height: '100vh',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: 0,
                    boxShadow: 'none',
                    background: 'transparent',
                  }}
                  draggable={false}
                />
                {/* Next Button */}
                {images.length > 1 && (
                  <IconButton
                    onClick={handleLightboxNext}
                    sx={{
                      position: 'absolute',
                      right: 16,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.25)',
                      color: '#fffbe9',
                      zIndex: 2,
                      '&:hover': {
                        background: 'rgba(0,0,0,0.45)',
                      },
                    }}
                    aria-label="다음 이미지"
                  >
                    <Iconify icon="solar:arrow-right-bold" width={32} height={32} />
                  </IconButton>
                )}
                {/* Close Button */}
                <IconButton
                  onClick={handleLightboxClose}
                  sx={{
                    position: 'absolute',
                    top: 24,
                    right: 24,
                    background: 'rgba(0,0,0,0.25)',
                    color: '#fffbe9',
                    zIndex: 3,
                    '&:hover': {
                      background: 'rgba(0,0,0,0.45)',
                    },
                  }}
                  aria-label="닫기"
                >
                  <Iconify icon="solar:close-circle-bold" width={32} height={32} />
                </IconButton>
              </Box>
            )}
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
}
