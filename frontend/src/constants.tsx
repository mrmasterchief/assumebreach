import { Icon } from '@iconify/react';

import { NavItem } from './types';

export const SIDENAV_ITEMS: NavItem[] = [
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
    title: 'Suits',
    path: '/suits',
    submenu: true,
    subMenuItems: [
      { title: 'Formal', path: '/suits/formal' },
      { title: 'Casual', path: '/suits/casual' },
      { title: 'Tuxedos', path: '/suits/tuxedos' },
    ],
  },
  {
    title: 'Accessories',
    path: '/accessories',
  },
  {
    title: 'Account',
    path: '/account',
    icon: <Icon icon="bx:bx-user" width="24" height="24" />,
    bottom: true,
  },
];


export const FOOTER_LINKS: NavItem[] = [
  {
    title: 'Customer Service',
    path: '/customer-service',
    submenu: true,
    subMenuItems: [
      { title: 'Contact Us', path: '/customer-service/contact-us' },
      { title: 'Shipping', path: '/customer-service/shipping' },
      { title: 'Returns', path: '/customer-service/returns' },
      { title: 'FAQ', path: '/customer-service/faq' },
    ],
  },
  {
    title: 'About Us',
    path: '/about-us',
    submenu: true,
    subMenuItems: [
      { title: 'Our Story', path: '/about-us/our-story' },
      { title: 'Careers', path: '/about-us/careers' },
      { title: 'Press', path: '/about-us/press' },
    ],
  },
];
