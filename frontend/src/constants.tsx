import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Shirts',
    path: '/shirts',
    submenu: true,
    subMenuItems: [
      { title: 'Girls', path: '/shirts/girls' },
      { title: 'Boys', path: '/shirts/boys' },
      { title: 'Unisex', path: '/shirts/unisex' },
    ],
  },
  {
    title: 'Pants',
    path: '/pants',
    submenu: true,
    subMenuItems: [
      { title: 'Jeans', path: '/pants/jeans' },
      { title: 'Shorts', path: '/pants/shorts' },
      { title: 'Leggings', path: '/pants/leggings' },
    ],
  },
  {
    title: 'Help',
    path: '/help',
    icon: <Icon icon="lucide:help-circle" width="24" height="24" />,
  },
];


export const FOOTER_LINKS = [
  { title: 'About Us', path: '/about' },
  { title: 'Contact', path: '/contact' },
  { title: 'Privacy Policy', path: '/privacy' },
  { title: 'Terms of Service', path: '/terms' },
  { title: 'Accessibility', path: '/accessibility' },
  { title: 'Scoreboard', path: '/scoreboard' },
];
