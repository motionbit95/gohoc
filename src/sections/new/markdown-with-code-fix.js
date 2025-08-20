import { COLORS } from 'src/constant/taility-colors';

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
                  fontFamily:
                    'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  border: `1.5px solid ${CODE_BORDER}`,
                  lineHeight: 2, // 줄간격 늘리기
                }}
              >
                <code {...props} className={className}>
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
                fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                border: `1px solid ${CODE_BORDER}`,
                lineHeight: 2, // 줄간격 늘리기
              }}
            >
              {children}
            </code>
          );
        },
        pre({ children, ...props }) {
          // pre 태그는 위 code에서 처리하므로 그냥 children만 반환
          return <>{children}</>;
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
                lineHeight: 2, // 줄간격 늘리기
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
        p({ children, ...props }) {
          // 일반 문단 줄간격 늘리기
          return (
            <p
              {...props}
              style={{
                lineHeight: 2,
                margin: '12px 0',
              }}
            >
              {children}
            </p>
          );
        },
        li({ children, ...props }) {
          // 리스트 줄간격 늘리기
          return (
            <li
              {...props}
              style={{
                lineHeight: 2,
                marginBottom: 8,
              }}
            >
              {children}
            </li>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}

export default MarkdownWithCodeFix;
