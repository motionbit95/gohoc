// Order 페이지 전용 스타일 상수
export const ORDER_COLORS = {
  BG_COLOR: 'white',
  TEXT_COLOR: '#111',
  ACCENT_COLOR: '#000',
  ACCENT_COLOR_DARK: '#888',
  PAPER_BG: '#f8f9fa',
  ALERT_BG: '#fff3cd',
  BORDER_COLOR: '#000',
  HOVER_COLOR: '#666',
  TRANSPARENT: 'transparent',
  SUCCESS_COLOR: '#28a745',
  ERROR_COLOR: '#dc3545',
  WARNING_COLOR: '#ffc107',
};

export const ORDER_FONTS = {
  HEADING: 'Pretendard, Noto Sans KR, sans-serif',
  BODY: 'Pretendard, Noto Sans KR, sans-serif',
};

export const ORDER_SPACING = {
  INPUT_MARGIN: 2,
  SECTION_MARGIN: 3,
  CONTAINER_PADDING: 3,
  ITEM_GAP: 2,
  BUTTON_PADDING: 2,
};

export const ORDER_SIZES = {
  UNIFIED_RADIUS: 0,
  UNIFIED_HEIGHT: 48,
  INPUT_HEIGHT: 48,
  BUTTON_HEIGHT: 40,
  ICON_SIZE: 24,
  THUMBNAIL_SIZE: 120,
  MODAL_WIDTH: 800,
  MODAL_HEIGHT: 600,
};

export const ORDER_BREAKPOINTS = {
  MOBILE: 'sm',
  TABLET: 'md',
  DESKTOP: 'lg',
};

// 등급 옵션
export const GRADE_OPTIONS = [
  { value: '샘플', label: '샘플' },
  { value: '~4일까지', label: '~4일까지' },
  { value: '~48시간안에', label: '~48시간안에' },
  { value: '당일 6시간 안에(3장이상부터)', label: '당일 6시간 안에(3장이상부터)' },
];

// 추가 옵션 목록
export const ADDITIONAL_OPTIONS = [
  { value: '필름 추가', label: '색감작업(필름)', price: 1500 },
  { value: '인원 추가', label: '인원 추가', price: 2000 },
  { value: '합성', label: '합성', price: 2000 },
];
