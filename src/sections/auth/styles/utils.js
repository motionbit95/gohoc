import { AUTH_COLORS, AUTH_FONTS, AUTH_SPACING, AUTH_SIZES } from './constants';

// 반응형 스타일 생성 함수
export const createResponsiveStyle = (mobileValue, desktopValue) => ({
  xs: mobileValue,
  sm: desktopValue,
});

// 폼 컨테이너 스타일
export const formContainerStyle = (isMobile) => ({
  width: '100%',
  maxWidth: 400,
  mx: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: AUTH_SPACING.GAP,
  background: AUTH_COLORS.PAPER_BG,
  borderRadius: 0,
  p: isMobile ? AUTH_SPACING.MOBILE_PADDING : AUTH_SPACING.DESKTOP_PADDING,
});

// 메인 컨테이너 스타일
export const mainContainerStyle = (isMobile) => ({
  minHeight: '100vh',
  bgcolor: AUTH_COLORS.BG_COLOR,
  display: 'flex',
  flexDirection: isMobile ? 'column' : 'row',
  alignItems: 'stretch',
  justifyContent: 'center',
  fontFamily: AUTH_FONTS.HEADING,
  px: 0,
});

// 중앙 폼 영역 스타일
export const centerFormStyle = (isMobile) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  py: isMobile ? AUTH_SPACING.MOBILE_PADDING : 0,
});

// 타이틀 컨테이너 스타일
export const titleContainerStyle = (isMobile) => ({
  width: '100%',
  textAlign: 'center',
  mb: isMobile ? AUTH_SPACING.MOBILE_MARGIN : AUTH_SPACING.DESKTOP_MARGIN,
});

// 타이틀 텍스트 스타일
export const titleTextStyle = (isMobile) => ({
  fontFamily: AUTH_FONTS.BODY,
  fontWeight: 400,
  fontSize: isMobile ? AUTH_SIZES.MOBILE_TITLE_FONT : AUTH_SIZES.DESKTOP_TITLE_FONT,
  color: 'rgba(0,0,0,0.5)',
  letterSpacing: 2,
  mb: 2,
});

// 좌측 타이틀 영역 스타일
export const leftTitleStyle = {
  position: 'relative',
  width: '20%',
  minWidth: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

// 회전된 타이틀 스타일
export const rotatedTitleStyle = {
  fontFamily: AUTH_FONTS.TITLE,
  fontSize: AUTH_SIZES.TITLE_FONT,
  transform: 'rotate(90deg)',
  transformOrigin: 'bottom left',
  whiteSpace: 'nowrap',
  lineHeight: 1,
  position: 'absolute',
  top: 0,
  left: -36,
  color: 'rgba(0,0,0,0.12)',
  userSelect: 'none',
};

// 구분선 컨테이너 스타일
export const dividerContainerStyle = {
  position: 'relative',
  width: '20%',
  minWidth: '100px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden', // 로고가 컨테이너를 벗어나지 않도록
};

// 구분선 스타일
export const dividerStyle = {
  position: 'absolute',
  width: 2, // 더 두껍게 보이도록
  backgroundColor: 'rgba(0,0,0,0.8)', // 약간 투명하게
  height: '100vh',
  left: '50%',
  transform: 'translateX(-1px)', // 중앙 정렬
};

// 라벨 스타일
export const labelStyle = (isMobile) => ({
  display: 'block',
  color: AUTH_COLORS.TEXT_COLOR,
  fontFamily: AUTH_FONTS.BODY,
  fontWeight: 600,
  mb: 1,
  fontSize: isMobile ? AUTH_SIZES.MOBILE_LABEL_FONT : AUTH_SIZES.DESKTOP_LABEL_FONT,
  letterSpacing: 1,
});

// 입력 필드 스타일
export const inputFieldStyle = (isMobile) => ({
  mb: AUTH_SPACING.INPUT_MARGIN,
  '& .MuiInput-underline:before': {
    borderBottom: `1.5px solid ${AUTH_COLORS.BORDER_COLOR}`,
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottom: `2px solid ${AUTH_COLORS.BORDER_COLOR}`,
  },
  '& .MuiInput-underline:after': {
    borderBottom: `2px solid ${AUTH_COLORS.BORDER_COLOR}`,
  },
});

// 입력 필드 InputProps 스타일
export const inputPropsStyle = (isMobile) => ({
  style: {
    background: AUTH_COLORS.TRANSPARENT,
    color: AUTH_COLORS.TEXT_COLOR,
    border: 'none',
    borderBottom: `1.5px solid ${AUTH_COLORS.BORDER_COLOR}`,
    fontFamily: AUTH_FONTS.BODY,
    fontSize: isMobile ? AUTH_SIZES.MOBILE_INPUT_FONT : AUTH_SIZES.DESKTOP_INPUT_FONT,
    padding: '8px 0',
  },
  disableUnderline: false,
});

// 버튼 스타일
export const buttonStyle = (isMobile) => ({
  width: 'auto',
  px: AUTH_SIZES.BUTTON_PADDING,
  alignSelf: 'center',
  mt: 2,
  background: AUTH_COLORS.ACCENT_COLOR,
  color: AUTH_COLORS.PAPER_BG,
  fontWeight: 600,
  fontFamily: AUTH_FONTS.BODY,
  fontSize: isMobile ? AUTH_SIZES.MOBILE_BUTTON_FONT : AUTH_SIZES.DESKTOP_BUTTON_FONT,
  borderRadius: 0,
  borderBottom: `2px solid ${AUTH_COLORS.BORDER_COLOR}`,
  boxShadow: 'none',
  letterSpacing: 1,
  '&:hover': {
    background: AUTH_COLORS.HOVER_COLOR,
    color: AUTH_COLORS.PAPER_BG,
    boxShadow: 'none',
  },
  transition: 'background 0.2s',
});
