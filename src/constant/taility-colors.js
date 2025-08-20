// Taility 프로젝트 색상 팔레트 (블랙 & 화이트 전용)
// 모든 컴포넌트에서 일관된 색상을 사용하기 위한 중앙 집중식 색상 관리

export const COLORS = {
  // 기본 배경 및 카드
  BG_COLOR: '#ffffff', // 메인 배경색 (화이트)
  PAPER_BG: '#f5f5f5', // 카드/섹션 배경색 (연한 그레이)

  // 텍스트
  TEXT_COLOR: '#111111', // 기본 텍스트 색상 (블랙)

  // 메인 액센트 (버튼, 포인트 등)
  ACCENT_COLOR: '#111111', // 액센트 색 (블랙)
  ACCENT_COLOR_DARK: '#000000', // 액센트 hover 등 (더 진한 블랙)

  // 버튼
  BUTTON_COLOR: '#111111', // 버튼 배경 (블랙)
  BUTTON_HOVER_COLOR: '#000000', // 버튼 hover (진한 블랙)
  BUTTON_TEXT_COLOR: '#ffffff', // 버튼 텍스트 (화이트)

  // 로그인 전용 (블랙)
  LOGIN_ACCENT_COLOR: '#111111',
  LOGIN_ACCENT_COLOR_DARK: '#000000',

  // 상세페이지 전용 색상 (화이트/블랙)
  DETAIL_BG_COLOR: '#ffffff', // 배경
  DETAIL_PAPER_BG: '#f5f5f5', // 카드/섹션 배경색
  DETAIL_ALERT_BG: 'rgba(0,0,0,0.04)',

  DETAIL_ACCENT_COLOR: '#111111', // 액센트 컬러 (블랙)
  DETAIL_ACCENT_COLOR_DARK: '#000000', // 액센트 hover 등 (진한 블랙)

  DETAIL_TEXT_COLOR: '#111111', // 텍스트 (블랙)
  DETAIL_SECTION_BG: '#f5f5f5', // 박스 배경 (연한 그레이)
  DETAIL_HIGHLIGHT_BG: '#e0e0e0', // 강조 배경 (밝은 그레이)
  DETAIL_SUBTEXT_COLOR: '#888888', // 설명, 서브텍스트 (중간 그레이)
  DETAIL_WARNING_COLOR: '#934343', // 경고 텍스트 (빨강, 유지)

  // 상태 컬러 (흑백 테마에 맞게 단순화)
  DIVIDER_COLOR: '#e0e0e0',
  ERROR_COLOR: '#934343',
  SUCCESS_COLOR: '#111111',
  WARNING_COLOR: '#111111',
  INFO_COLOR: '#111111',
};

export const FONTS = {
  HEADING: 'Pretendard, Noto Sans KR, sans-serif',
  SERIF: 'Noto Serif KR, serif',
  MONOSPACE: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

export const STYLES = {
  UNIFIED_RADIUS: 0, // theme.spacing 단위
  UNIFIED_HEIGHT: 44, // px, 모든 input/셀렉트 높이 통일

  // 그림자 설정 (흑백에 맞게 약하게)
  SHADOW_LIGHT: '0 2px 16px 0 rgba(0,0,0,0.04)',
  SHADOW_MEDIUM: '0 2px 12px 0 rgba(0,0,0,0.08)',
  SHADOW_ACCENT: '0 2px 8px 0 rgba(0,0,0,0.12)',

  // 텍스트 그림자
  TEXT_SHADOW: '0 1px 2px rgba(0,0,0,0.08)',
  TEXT_SHADOW_DARK: '0 1px 2px rgba(0,0,0,0.16)',
};

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

export const getThemeColors = (themeSet = 'main') => THEME_SETS[themeSet] || THEME_SETS.main;

export const colorUtils = {
  // 투명도가 적용된 색상 생성
  withOpacity: (color, opacity) => {
    // HEX 색상을 RGBA로 변환
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // 이미 rgba나 다른 포맷이면 그대로 사용
    return color;
  },

  // 밝기 조정 (흑백 한정)
  lighten: (color, amount) => {
    if (color === '#000000' || color === '#111111') {
      // 블랙을 amount만큼 밝게 (흰색에 가까워짐)
      const v = Math.min(255, amount);
      return `#${v.toString(16).padStart(2, '0').repeat(3)}`;
    }
    if (color === '#ffffff') {
      return '#ffffff';
    }
    // 기본: 기존 hex 밝기 증가
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },

  // 어둡게 조정 (흑백 한정)
  darken: (color, amount) => {
    if (color === '#ffffff') {
      // amount만큼 어둡게 (블랙에 가까워짐)
      const v = Math.max(0, 255 - amount);
      return `#${v.toString(16).padStart(2, '0').repeat(3)}`;
    }
    if (color === '#000000' || color === '#111111') {
      return '#000000';
    }
    // 기본: 기존 hex 밝기 감소
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  },
};

export const sxHelpers = {
  // 기본 박스 스타일
  box: (themeSet = 'main') => {
    const colors = getThemeColors(themeSet);
    return {
      background: colors.bgColor,
      borderRadius: 0,
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
      borderRadius: 0,
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
