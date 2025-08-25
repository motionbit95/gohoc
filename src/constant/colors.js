// WantsWedding 프로젝트 색상 팔레트
// 모든 컴포넌트에서 일관된 색상을 사용하기 위한 중앙 집중식 색상 관리

export const COLORS = {
  BG_COLOR: '#FDFBF7', // 메인 배경 (이미지 기준 밝은 화이트)
  PAPER_BG: '#E7E2D2', // 카드/섹션 배경
  TEXT_COLOR: '#5B4C2B', // 기본 텍스트 (소프트 브라운)

  ACCENT_COLOR: '#ffe082', // 액센트 (밝은 옐로우)
  ACCENT_COLOR_DARK: '#e6c86a', // 액센트 다크

  BUTTON_COLOR: '#746D4B', // 버튼 배경
  BUTTON_HOVER_COLOR: '#68644F', // 버튼 hover
  BUTTON_TEXT_COLOR: '#fffbe9', // 버튼 텍스트

  LOGIN_ACCENT_COLOR: '#746D4B',
  LOGIN_ACCENT_COLOR_DARK: '#68644F',

  DETAIL_BG_COLOR: '#FDFBF7',
  DETAIL_PAPER_BG: '#E7E2D2',
  DETAIL_ALERT_BG: 'rgba(110, 133, 87, 0.2)',

  DETAIL_ACCENT_COLOR: '#006C92',
  DETAIL_ACCENT_COLOR_DARK: '#F6C18C',

  DETAIL_TEXT_COLOR: 'black',
  DETAIL_SECTION_BG: '#E7E2D2',
  DETAIL_HIGHLIGHT_BG: '#D9D1B4',
  DETAIL_SUBTEXT_COLOR: '#9C937F',
  DETAIL_WARNING_COLOR: '#D7562B',

  DIVIDER_COLOR: '#A79166',
  ERROR_COLOR: '#d32f2f',
  SUCCESS_COLOR: '#388e3c',
  WARNING_COLOR: '#ed6c02',
  INFO_COLOR: '#0288d1',
};

// 폰트 설정
export const FONTS = {
  HEADING: 'Pretendard, Noto Sans KR, sans-serif',
  SERIF: 'Noto Serif KR, serif',
  MONOSPACE: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

// 스타일 상수
export const STYLES = {
  // 통일된 input 스타일 변수
  UNIFIED_RADIUS: 1, // theme.spacing 단위
  UNIFIED_HEIGHT: 44, // px, 모든 input/셀렉트 높이 통일

  // 그림자 설정
  SHADOW_LIGHT: '0 2px 16px 0 rgba(35,41,31,0.08)',
  SHADOW_MEDIUM: '0 2px 12px 0 rgba(35,41,31,0.10)',
  SHADOW_ACCENT: '0 2px 8px 0 rgba(255,224,130,0.15)',

  // 텍스트 그림자
  TEXT_SHADOW: '0 1px 2px rgba(0,0,0,0.10)',
  TEXT_SHADOW_DARK: '0 1px 2px rgba(0,0,0,0.18)',
};

// 테마별 색상 세트 (컴포넌트별로 사용)
export const THEME_SETS = {
  // 메인 테마 (대부분의 컴포넌트)
  main: {
    bgColor: COLORS.BG_COLOR,
    paperBg: COLORS.PAPER_BG,
    textColor: COLORS.TEXT_COLOR,
    accentColor: COLORS.ACCENT_COLOR,
    accentColorDark: COLORS.ACCENT_COLOR_DARK,
  },

  // 로그인 페이지 테마
  login: {
    bgColor: COLORS.BG_COLOR,
    paperBg: COLORS.BG_COLOR,
    textColor: COLORS.TEXT_COLOR,
    accentColor: COLORS.LOGIN_ACCENT_COLOR,
    accentColorDark: COLORS.LOGIN_ACCENT_COLOR_DARK,
  },

  // 인트로 페이지 테마
  intro: {
    bgColor: COLORS.BG_COLOR,
    textColor: COLORS.TEXT_COLOR,
    accentColor: COLORS.LOGIN_ACCENT_COLOR,
    accentColorDark: COLORS.LOGIN_ACCENT_COLOR_DARK,
  },
};

// 편의 함수들
export const getThemeColors = (themeSet = 'main') => THEME_SETS[themeSet] || THEME_SETS.main;

// 색상 유틸리티 함수들
export const colorUtils = {
  // 투명도가 적용된 색상 생성
  withOpacity: (color, opacity) => {
    // HEX 색상을 RGBA로 변환
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  // 밝기 조정 (간단한 버전)
  lighten: (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  // 어둡게 조정 (간단한 버전)
  darken: (color, amount) => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

// MUI sx 스타일 헬퍼 함수들
export const sxHelpers = {
  // 기본 박스 스타일
  box: (themeSet = 'main') => {
    const colors = getThemeColors(themeSet);
    return {
      background: colors.bgColor,
      borderRadius: 3,
      color: colors.textColor,
      boxShadow: STYLES.SHADOW_LIGHT,
    };
  },

  // 제목 스타일
  title: (themeSet = 'main') => {
    const colors = getThemeColors(themeSet);
    return {
      color: colors.accentColor,
      fontWeight: 800,
      letterSpacing: 0.5,
      fontSize: { xs: 20, sm: 22 },
      textShadow: STYLES.TEXT_SHADOW,
    };
  },

  // 버튼 스타일
  button: (themeSet = 'main', variant = 'contained') => {
    const colors = getThemeColors(themeSet);
    const baseStyle = {
      fontWeight: 700,
      fontSize: 16,
      letterSpacing: 0.5,
      borderRadius: 2,
      transition: 'background 0.2s, color 0.2s',
    };

    if (variant === 'contained') {
      return {
        ...baseStyle,
        background: colors.accentColor,
        color: colors.bgColor,
        boxShadow: STYLES.SHADOW_ACCENT,
        '&:hover': {
          background: colors.accentColorDark,
          color: colors.bgColor,
          boxShadow: STYLES.SHADOW_ACCENT,
        },
      };
    }

    return baseStyle;
  },

  // 입력 필드 스타일
  input: (themeSet = 'main') => {
    const colors = getThemeColors(themeSet);
    return {
      color: colors.textColor,
      background: colors.bgColor,
      borderRadius: STYLES.UNIFIED_RADIUS,
      fontWeight: 500,
      letterSpacing: 0.5,
      height: STYLES.UNIFIED_HEIGHT,
      minHeight: STYLES.UNIFIED_HEIGHT,
      '& .MuiInputBase-input': {
        color: colors.textColor,
        height: STYLES.UNIFIED_HEIGHT - 2,
        minHeight: STYLES.UNIFIED_HEIGHT - 2,
        boxSizing: 'border-box',
        padding: '0 14px',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiOutlinedInput-root': {
        borderRadius: STYLES.UNIFIED_RADIUS,
        minHeight: STYLES.UNIFIED_HEIGHT,
        height: STYLES.UNIFIED_HEIGHT,
        '& fieldset': {
          borderRadius: STYLES.UNIFIED_RADIUS,
        },
        '&.Mui-focused fieldset': {
          borderColor: colors.accentColor,
        },
      },
      '& .MuiInputLabel-root': {
        color: colors.accentColor,
        fontWeight: 700,
        letterSpacing: 0.2,
        fontSize: 16,
        textShadow: STYLES.TEXT_SHADOW_DARK,
        lineHeight: 1.2,
      },
    };
  },
};

// 기본 export (하위 호환성을 위해)
export default {
  COLORS,
  FONTS,
  STYLES,
  THEME_SETS,
  getThemeColors,
  colorUtils,
  sxHelpers,
};
