import { ORDER_COLORS, ORDER_FONTS, ORDER_SPACING, ORDER_SIZES } from './constants';

// 통일된 input 스타일
export const unifiedInputStyle = {
  color: ORDER_COLORS.TEXT_COLOR,
  background: ORDER_COLORS.BG_COLOR,
  borderRadius: ORDER_SIZES.UNIFIED_RADIUS,
  fontWeight: 500,
  letterSpacing: 0.5,
  height: ORDER_SIZES.UNIFIED_HEIGHT,
  minHeight: ORDER_SIZES.UNIFIED_HEIGHT,
  boxSizing: 'border-box',
  mb: ORDER_SPACING.INPUT_MARGIN,
  '& .MuiInputBase-input': {
    color: ORDER_COLORS.TEXT_COLOR,
    height: ORDER_SIZES.UNIFIED_HEIGHT - 2,
    minHeight: ORDER_SIZES.UNIFIED_HEIGHT - 2,
    boxSizing: 'border-box',
    padding: '0 14px',
    display: 'flex',
    alignItems: 'center',
    background: 'none',
  },
  '& .MuiOutlinedInput-root': {
    borderRadius: ORDER_SIZES.UNIFIED_RADIUS,
    minHeight: ORDER_SIZES.UNIFIED_HEIGHT,
    height: ORDER_SIZES.UNIFIED_HEIGHT,
    background: ORDER_COLORS.BG_COLOR,
    boxShadow: 'none',
    '& fieldset': {
      borderRadius: ORDER_SIZES.UNIFIED_RADIUS,
      borderColor: ORDER_COLORS.ACCENT_COLOR,
    },
    '&:hover fieldset': {
      borderColor: ORDER_COLORS.ACCENT_COLOR,
    },
    '&.Mui-focused fieldset': {
      borderColor: ORDER_COLORS.ACCENT_COLOR,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: ORDER_COLORS.ACCENT_COLOR,
    fontWeight: 600,
    fontSize: 14,
  },
};

// 체크박스 스타일
export const checkboxStyle = {
  color: ORDER_COLORS.ACCENT_COLOR_DARK,
  '&.Mui-checked': {
    color: ORDER_COLORS.ACCENT_COLOR_DARK,
  },
  transform: 'scale(1.5)',
  marginRight: 2,
};

// 체크박스 라벨 스타일
export const checkboxLabelStyle = {
  alignItems: 'flex-start',
  color: ORDER_COLORS.TEXT_COLOR,
  '.MuiFormControlLabel-label': {
    fontSize: { xs: 15, sm: 16 },
    fontWeight: 600,
    lineHeight: 1.7,
    letterSpacing: 0.1,
    textShadow: '0 1px 2px rgba(0,0,0,0.10)',
    wordBreak: 'keep-all',
  },
};

// 전체 동의 체크박스 라벨 스타일
export const allAgreeLabelStyle = {
  alignItems: 'flex-start',
  mt: 2,
  color: ORDER_COLORS.ACCENT_COLOR_DARK,
  '.MuiFormControlLabel-label': {
    fontSize: { xs: 16, sm: 17 },
    fontWeight: 800,
    lineHeight: 2.0,
    letterSpacing: 0.15,
    textShadow: '0 1px 2px rgba(0,0,0,0.10)',
    wordBreak: 'keep-all',
  },
};

// 섹션 컨테이너 스타일
export const sectionContainerStyle = {
  my: ORDER_SPACING.SECTION_MARGIN,
  py: { xs: 2, sm: 3 },
  color: ORDER_COLORS.TEXT_COLOR,
};

// 이미지 업로더 컨테이너 스타일
export const imageUploaderContainerStyle = {
  backgroundColor: ORDER_COLORS.PAPER_BG,
  borderRadius: 2,
  p: ORDER_SPACING.CONTAINER_PADDING,
  border: `1px solid ${ORDER_COLORS.BORDER_COLOR}`,
};

// 썸네일 스타일
export const thumbnailStyle = {
  width: ORDER_SIZES.THUMBNAIL_SIZE,
  height: ORDER_SIZES.THUMBNAIL_SIZE,
  objectFit: 'cover',
  borderRadius: 1,
  cursor: 'pointer',
  border: `2px solid ${ORDER_COLORS.TRANSPARENT}`,
  '&:hover': {
    borderColor: ORDER_COLORS.ACCENT_COLOR,
  },
};

// 모달 스타일
export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: ORDER_SIZES.MODAL_WIDTH,
  height: ORDER_SIZES.MODAL_HEIGHT,
  bgcolor: ORDER_COLORS.BG_COLOR,
  border: `2px solid ${ORDER_COLORS.BORDER_COLOR}`,
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
  overflow: 'auto',
};

// 버튼 스타일
export const buttonStyle = (variant = 'contained') => ({
  height: ORDER_SIZES.BUTTON_HEIGHT,
  borderRadius: ORDER_SIZES.UNIFIED_RADIUS,
  fontWeight: 600,
  textTransform: 'none',
  ...(variant === 'contained' && {
    backgroundColor: ORDER_COLORS.ACCENT_COLOR,
    color: ORDER_COLORS.BG_COLOR,
    '&:hover': {
      backgroundColor: ORDER_COLORS.HOVER_COLOR,
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: ORDER_COLORS.ACCENT_COLOR,
    color: ORDER_COLORS.ACCENT_COLOR,
    '&:hover': {
      borderColor: ORDER_COLORS.HOVER_COLOR,
      color: ORDER_COLORS.HOVER_COLOR,
    },
  }),
});

// 반응형 스타일 생성 함수
export const createResponsiveStyle = (mobileValue, desktopValue) => ({
  xs: mobileValue,
  sm: desktopValue,
});
