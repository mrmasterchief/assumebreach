import { Icon } from '@iconify/react';

import { NavItem } from '@/components/nav/NavTypes';

export const SIDENAV_ITEMS: NavItem[] = [
  {
    title: 'Shirts',
    path: '/products?category=shirts',
    submenu: true,
    subMenuItems: [
      {title: 'All shirts', path: '/products?category=shirts'},
      { title: 'Women', path: '/products?category=shirts&sex=women' },
      { title: 'Men', path: '/products?category=shirts&sex=men' },
      { title: 'Unisex', path: '/products?category=shirts&sex=unisex' },
    ],
  },
  {
    title: 'Pants',
    path: '/products?category=pants',
    submenu: true,
    subMenuItems: [
      { title: 'Jeans', path: '/products?category=pants&style=jeans' },
      { title: 'Shorts', path: '/products?category=pants&style=shorts' },
      { title: 'Leggings', path: '/products?category=pants&style=leggings' },
    ],
  },
  {
    title: 'Suits',
    path: '/products?category=suits',
    submenu: true,
    subMenuItems: [
      { title: 'All suits', path: '/products?category=suits' },
      { title: 'Formal', path: '/products?category=suits&style=formal' },
      { title: 'Casual', path: '/products?category=suits&style=casual' },
      { title: 'Tuxedos', path: '/products?category=suits&style=tuxedos' },
    ],
  },
  {
    title: 'Accessories',
    path: '/products?category=accessories',
  },
  {
    title: 'Account',
    path: '/account',
    icon: <Icon icon="bx:bx-user" width="24" height="24" color='white' />,
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
  {
    title: 'CTF',
    path: '/ctf',
    submenu: true,
    subMenuItems: [
      { title: 'Scoreboard', path: '/ctf/scoreboard' },
      { title: 'Rules', path: '/ctf/rules' },
      { title: 'Info', path: '/ctf/info' },
    ],
  }
];

export const CMS_SIDENAV_ITEMS = [
  {
    icon: <Icon icon="bx:bx-cart" width="24" height="24" color='white' />,
    title: 'Products',
  },
  {
    icon: <Icon icon="bx:bx-list-ul" width="24" height="24" color='white' />,
    title: 'Orders',
  },
  {
    icon: <Icon icon="bx:bx-user" width="24" height="24" color='white' />,
    title: 'Customers',
  },
  {
    icon: <Icon icon="bx:bx-cog" width="24" height="24" color='white' />,
    title: 'Settings',
  },
];

export const CATEGORIES = [
  'Shirts',
  'Pants',
  'Suits',
  'Accessories',
  'Sale',
  'Weekly Picks',
  'Latest Drops',
  'Tuxedos',
  'Jeans',
  'Shorts',
  'Leggings',
  'Formal',
  'Casual',
  'Women',
  'Men',
  'Unisex',
  'All shirts',
  'All suits',
];