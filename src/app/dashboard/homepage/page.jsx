import { CONFIG } from 'src/global-config';

import { HomepageSettingsView } from 'src/sections/homepage/view';

// ----------------------------------------------------------------------

export const metadata = { title: `홈페이지 설정 | ${CONFIG.appName}` };

export default function Page() {
  return <HomepageSettingsView title="홈페이지 설정" />;
}
