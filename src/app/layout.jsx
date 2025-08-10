import 'src/global.css';

import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { CONFIG } from 'src/global-config';
import { primary } from 'src/theme/core/palette';
import { themeConfig, ThemeProvider } from 'src/theme';
import { _workspaces } from 'src/layouts/nav-config-workspace';
import { WorkspaceProvider } from 'src/layouts/components/workspaces-popover';

import { Snackbar } from 'src/components/snackbar';
import { ProgressBar } from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { detectSettings } from 'src/components/settings/server';
import { SettingsDrawer, defaultSettings, SettingsProvider } from 'src/components/settings';

import { AuthProvider } from 'src/auth/context/jwt';

// ----------------------------------------------------------------------

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: primary.main,
};

export const metadata = {
  icons: [
    {
      rel: 'icon',
      url: `${CONFIG.assetsDir}/favicon.ico`,
    },
  ],
};

// ----------------------------------------------------------------------

async function getAppConfig() {
  if (CONFIG.isStaticExport) {
    return {
      cookieSettings: undefined,
      dir: defaultSettings.direction,
    };
  } else {
    const [settings] = await Promise.all([detectSettings()]);

    return {
      cookieSettings: settings,
      dir: settings.direction,
    };
  }
}

export default async function RootLayout({ children }) {
  const appConfig = await getAppConfig();

  return (
    <html lang="en" dir={appConfig.dir} suppressHydrationWarning translate="no">
      <body>
        <InitColorSchemeScript
          modeStorageKey={themeConfig.modeStorageKey}
          attribute={themeConfig.cssVariables.colorSchemeSelector}
          defaultMode={themeConfig.enableSystemMode ? 'system' : themeConfig.defaultMode}
        />

        <AuthProvider>
          <SettingsProvider
            cookieSettings={appConfig.cookieSettings}
            defaultSettings={defaultSettings}
          >
            <AppRouterCacheProvider options={{ key: 'css' }}>
              <ThemeProvider
                modeStorageKey={themeConfig.modeStorageKey}
                defaultMode={themeConfig.enableSystemMode ? 'system' : themeConfig.defaultMode}
              >
                {/* 새로고침해도 안바뀌게 하려면 localStorage에서 불러오도록 수정 */}
                <WorkspaceProvider initialWorkspace={_workspaces}>
                  <MotionLazy>
                    <Snackbar />
                    <ProgressBar />
                    <SettingsDrawer defaultSettings={defaultSettings} />
                    {children}
                  </MotionLazy>
                </WorkspaceProvider>
              </ThemeProvider>
            </AppRouterCacheProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
