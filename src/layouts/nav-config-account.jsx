import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: '홈페이지설정',
    href: '/dashboard/homepage',
    icon: <Iconify icon="solar:home-angle-bold-duotone" />,
  },
  {
    label: '상품관리',
    href: '/dashboard/product',
    icon: <Iconify icon="solar:notes-bold-duotone" />,
  },
  {
    label: '작업자관리',
    href: '/dashboard/worker',
    icon: <Iconify icon="custom:profile-duotone" />,
  },
  {
    label: '유저관리',
    href: '/dashboard/user',
    icon: <Iconify icon="custom:profile-duotone" />,
  },
  {
    label: 'Security',
    href: '#',
    icon: <Iconify icon="solar:shield-keyhole-bold-duotone" />,
  },
  {
    label: 'Account settings',
    href: '#',
    icon: <Iconify icon="solar:settings-bold-duotone" />,
  },
];
