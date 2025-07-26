import { CONFIG } from 'src/global-config';

import ProductDeadlineRulesView from 'src/sections/product/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page three | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <ProductDeadlineRulesView title="Page three" />;
}
