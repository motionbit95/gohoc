import { Markdown } from 'src/components/markdown';

const BG_COLOR = '#23291f'; // 더 중립적이고 부드러운 다크 그린
const TEXT_COLOR = '#fffbe9'; // 더 밝고 명확한 베이지/화이트로 변경 (가독성 ↑)
const ACCENT_COLOR = '#ffe082'; // 더 밝은 골드/옐로우로 변경 (가독성 ↑)
const ACCENT_COLOR_DARK = '#ffd54f'; // hover 등 진한 포인트
const PAPER_BG = '#2e3527'; // 카드 배경, BG_COLOR보다 더 밝게

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
                  background: '#181818',
                  color: '#ffe082',
                  borderRadius: 6,
                  padding: '12px 16px',
                  fontSize: 14,
                  overflowX: 'auto',
                  margin: '12px 0',
                  fontFamily:
                    'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  border: `1.5px solid ${ACCENT_COLOR}`,
                  boxShadow: '0 1px 4px 0 rgba(35,41,31,0.10)',
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
                background: '#181818',
                color: ACCENT_COLOR,
                borderRadius: 4,
                padding: '2px 6px',
                fontSize: 14,
                fontFamily: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                border: `1px solid ${ACCENT_COLOR}`,
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
                color: '#ffd54f',
                fontWeight: 700,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                background: 'linear-gradient(90deg, #ffe08233 0%, #ffd54f33 100%)',
                borderRadius: 3,
                padding: '0 2px',
                transition: 'color 0.15s, background 0.15s',
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
      }}
    >
      {children}
    </Markdown>
  );
}

export default MarkdownWithCodeFix;
