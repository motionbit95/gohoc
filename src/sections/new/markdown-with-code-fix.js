import { COLORS } from 'src/constant/colors';

import { Markdown } from 'src/components/markdown';

// 색상 상수 (상세페이지 전용 팔레트 포함)
const BG_COLOR = COLORS.DETAIL_BG_COLOR;
const TEXT_COLOR = COLORS.DETAIL_TEXT_COLOR;
const ACCENT_COLOR = COLORS.DETAIL_ACCENT_COLOR_DARK; // 진한 그린
const ACCENT_BG = COLORS.DETAIL_ALERT_BG; // 연한 그린 배경
const LINK_COLOR = COLORS.ERROR_COLOR; // 링크 강조색
const LINK_BG = 'transparent'; // 링크 배경 강조
const CODE_BG = COLORS.DETAIL_SECTION_BG; // 코드 블록 배경 (연한 베이지)
const CODE_BORDER = COLORS.DETAIL_ACCENT_COLOR_DARK; // 코드 블록 테두리

function MarkdownWithCodeFix({ children }) {
  return (
    <Markdown
      components={{
        code({ className, children, ...props }) {
          // block code
          if (className && className.startsWith('language-')) {
            return (
              <pre
                style={{
                  background: CODE_BG,
                  color: ACCENT_COLOR,
                  borderRadius: 6,
                  padding: '12px 16px',
                  fontSize: 14,
                  overflowX: 'auto',
                  margin: '12px 0',
                  fontFamily: 'GumiRomanceTTF',
                  border: `1.5px solid ${CODE_BORDER}`,
                }}
              >
                <code {...props} className={className} style={{ fontFamily: 'GumiRomanceTTF' }}>
                  {children}
                </code>
              </pre>
            );
          }
          // inline code
          return (
            <code
              {...props}
              style={{
                background: CODE_BG,
                color: ACCENT_COLOR,
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 14,
                fontFamily: 'GumiRomanceTTF',
                border: `1px solid ${CODE_BORDER}`,
              }}
            >
              {children}
            </code>
          );
        },
        pre({ children, ...props }) {
          // pre 태그는 위 code에서 처리하므로 그냥 children만 반환
          return <span style={{ fontFamily: 'GumiRomanceTTF' }}>{children}</span>;
        },
        a({ children, href, ...props }) {
          // 강조된 링크 스타일
          return (
            <a
              href={href}
              {...props}
              style={{
                color: LINK_COLOR,
                fontWeight: 700,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                background: `linear-gradient(90deg, ${LINK_BG}33 0%, ${ACCENT_BG} 100%)`,
                borderRadius: 3,
                padding: '0 2px',
                transition: 'color 0.15s, background 0.15s',
                fontFamily: 'GumiRomanceTTF',
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        // 모든 텍스트에 fontFamily 적용 (p, li, etc.)
        p({ children, ...props }) {
          return (
            <p {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </p>
          );
        },
        li({ children, ...props }) {
          return (
            <li {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </li>
          );
        },
        h1({ children, ...props }) {
          return (
            <h1 {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </h1>
          );
        },
        h2({ children, ...props }) {
          return (
            <h2 {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </h2>
          );
        },
        h3({ children, ...props }) {
          return (
            <h3 {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </h3>
          );
        },
        h4({ children, ...props }) {
          return (
            <h4 {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </h4>
          );
        },
        h5({ children, ...props }) {
          return (
            <h5 {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </h5>
          );
        },
        h6({ children, ...props }) {
          return (
            <h6 {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </h6>
          );
        },
        ul({ children, ...props }) {
          return (
            <ul {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </ul>
          );
        },
        ol({ children, ...props }) {
          return (
            <ol {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </ol>
          );
        },
        strong({ children, ...props }) {
          return (
            <strong {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </strong>
          );
        },
        em({ children, ...props }) {
          return (
            <em {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </em>
          );
        },
        span({ children, ...props }) {
          return (
            <span {...props} style={{ fontFamily: 'GumiRomanceTTF' }}>
              {children}
            </span>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}

export default MarkdownWithCodeFix;
