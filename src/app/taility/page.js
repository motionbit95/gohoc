import Taility from 'src/sections/intro/view/taility-intro-view';

export const metadata = {
  title: '테일리티',
  icons: {
    icon: '/테일리티.ico', // 또는 .png, .svg 등
  },
  description: 'Taility',
};

export default function Page() {
  return <Taility />;
}
