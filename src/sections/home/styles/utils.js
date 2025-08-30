import { HOME_COLORS, HOME_FONTS, HOME_SPACING, HOME_SIZES } from './constants';

// 반응형 스타일 생성 함수
export const createResponsiveStyle = (mobileValue, desktopValue) => ({
  xs: mobileValue,
  sm: desktopValue,
});

// 메인 컨테이너 스타일
export const mainContainerStyle = {
  minHeight: '100vh',
  background: HOME_COLORS.BG_COLOR,
  color: HOME_COLORS.TEXT_COLOR,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  py: HOME_SPACING.PAGE_PADDING,
  gap: HOME_SPACING.PAGE_GAP,
};

// 컨테이너 스타일
export const containerStyle = {
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: HOME_SPACING.CONTAINER_GAP,
  mt: 0,
};

// 기본 액션 버튼 스타일 (intro-view용)
export const actionButtonStyle = (isMobile) => ({
  background: HOME_COLORS.ACCENT_COLOR,
  color: HOME_COLORS.TEXT_COLOR,
  fontSize: isMobile ? HOME_SIZES.MOBILE_FONT : HOME_SIZES.DESKTOP_FONT,
  fontFamily: HOME_FONTS.HEADING,
  borderRadius: 0,
  boxShadow: 'none',
  py: isMobile ? HOME_SPACING.MOBILE_PADDING : HOME_SPACING.DESKTOP_PADDING,
  px: isMobile ? HOME_SPACING.MOBILE_MARGIN : HOME_SPACING.DESKTOP_MARGIN,
  width: '100%',
  maxWidth: isMobile ? HOME_SIZES.MOBILE_MAX_WIDTH : HOME_SIZES.DESKTOP_MAX_WIDTH,
  minHeight: isMobile ? HOME_SIZES.MOBILE_BUTTON_HEIGHT : HOME_SIZES.DESKTOP_BUTTON_HEIGHT,
  letterSpacing: 1.2,
  fontWeight: 700,
  borderBottom: `${HOME_SIZES.BORDER_WIDTH}px solid ${HOME_COLORS.BORDER_COLOR}`,
  '&:hover': {
    background: HOME_COLORS.ACCENT_COLOR_DARK,
    color: HOME_COLORS.TEXT_COLOR,
    boxShadow: 'none',
  },
  transition: 'background 0.2s',
});

// Taility 액션 버튼 스타일 (taility-intro-view용)
export const tailityActionButtonStyle = (isMobile) => ({
  background: HOME_COLORS.TRANSPARENT,
  color: HOME_COLORS.ACCENT_COLOR,
  fontSize: isMobile ? HOME_SIZES.MOBILE_FONT : HOME_SIZES.DESKTOP_FONT,
  fontFamily: HOME_FONTS.HEADING,
  borderRadius: 0,
  boxShadow: 'none',
  py: isMobile ? HOME_SPACING.MOBILE_PADDING : HOME_SPACING.DESKTOP_PADDING,
  px: isMobile ? HOME_SPACING.MOBILE_MARGIN : HOME_SPACING.DESKTOP_MARGIN,
  width: '100%',
  maxWidth: isMobile ? HOME_SIZES.MOBILE_MAX_WIDTH : HOME_SIZES.DESKTOP_MAX_WIDTH,
  minHeight: isMobile ? HOME_SIZES.MOBILE_BUTTON_HEIGHT : HOME_SIZES.DESKTOP_BUTTON_HEIGHT,
  borderBottom: `${HOME_SIZES.BORDER_WIDTH_THICK}px solid ${HOME_COLORS.ACCENT_COLOR}`,
  fontWeight: 700,
  '&:hover': {
    background: HOME_COLORS.HOVER_BG,
    color: HOME_COLORS.ACCENT_COLOR_DARK,
    borderBottom: `${HOME_SIZES.BORDER_WIDTH_THICK}px solid ${HOME_COLORS.ACCENT_COLOR_DARK}`,
    boxShadow: 'none',
  },
  transition: 'all 0.2s',
});
