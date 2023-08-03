import { adminAndOwnerOnly, adminOwnerAndStaffOnly } from '@/utils/auth-utils';
import { Routes } from '@/config/routes';
import { PiDevices } from 'react-icons/pi';
import { BsSim } from 'react-icons/bs';
import { FiUsers } from 'react-icons/fi';
import { TbDeviceAnalytics } from 'react-icons/tb';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
export const siteSettings = {
  name: 'Pixer',
  description: '',
  logo: {
    url: '/logo.svg',
    alt: 'Pixer',
    href: '/',
    width: 128,
    height: 40,
  },
  defaultLanguage: 'en',
  author: {
    name: 'Lypras, Inc.',
    websiteUrl: 'https://redq.io',
    address: '',
  },
  headerLinks: [],
  authorizedLinks: [
    // {
    //   href: Routes.profileUpdate,
    //   labelTransKey: 'authorized-nav-item-profile',
    // },
    // {
    //   href: Routes.logout,
    //   labelTransKey: 'authorized-nav-item-logout',
    // },
  ],
  currencyCode: 'USD',
  sidebarLinks: {
    admin: [
      {
        href: Routes.dashboard,
        label: 'sidebar-nav-item-dashboard',
        icon: MdOutlineDashboardCustomize,
      },
      {
        href: Routes.devices.list,
        label: 'sidebar-nav-item-devices',
        icon: PiDevices,
      },
      {
        href: Routes.sims.list,
        label: 'sidebar-nav-item-sims',
        icon: BsSim,
      },
      {
        href: Routes.customers.list,
        label: 'sidebar-nav-item-customers',
        icon: FiUsers,
      },
      {
        href: Routes.usages.list,
        label: 'sidebar-nav-item-usages',
        icon: TbDeviceAnalytics,
      },

      {
        href: Routes.files.list,
        label: 'sidebar-nav-item-usages',
        icon: TbDeviceAnalytics,
      },
      // {
      //   href: Routes.shop.list,
      //   label: 'sidebar-nav-item-shops',
      //   icon: 'ShopIcon',
      // },
      // {
      //   href: Routes.adminMyShops,
      //   label: 'sidebar-nav-item-my-shops',
      //   icon: 'MyShopIcon',
      // },
      // {
      //   href: Routes.product.list,
      //   label: 'sidebar-nav-item-products',
      //   icon: 'ProductsIcon',
      // },
      // {
      //   href: Routes.type.list,
      //   label: 'sidebar-nav-item-groups',
      //   icon: 'TypesIcon',
      // },
      // {
      //   href: Routes.category.list,
      //   label: 'sidebar-nav-item-categories',
      //   icon: 'CategoriesIcon',
      // },
      // {
      //   href: Routes.tag.list,
      //   label: 'sidebar-nav-item-tags',
      //   icon: 'TagIcon',
      // },
      // {
      //   href: Routes.order.list,
      //   label: 'sidebar-nav-item-orders',
      //   icon: 'OrdersIcon',
      // },
      // {
      //   href: Routes.order.create,
      //   label: 'sidebar-nav-item-create-order',
      //   icon: 'CalendarScheduleIcon',
      // },
      // {
      //   href: Routes.user.list,
      //   label: 'sidebar-nav-item-users',
      //   icon: 'UsersIcon',
      // },
      // {
      //   href: Routes.tax.list,
      //   label: 'sidebar-nav-item-taxes',
      //   icon: 'TaxesIcon',
      // },
      // {
      //   href: Routes.withdraw.list,
      //   label: 'sidebar-nav-item-withdraws',
      //   icon: 'WithdrawIcon',
      // },
      // {
      //   href: Routes.question.list,
      //   label: 'sidebar-nav-item-questions',
      //   icon: 'QuestionIcon',
      // },
      // {
      //   href: Routes.reviews.list,
      //   label: 'sidebar-nav-item-reviews',
      //   icon: 'ReviewIcon',
      // },
      // {
      //   href: Routes.settings,
      //   label: 'sidebar-nav-item-settings',
      //   icon: 'SettingsIcon',
      // },
    ],
    shop: [
      {
        href: (shop: string) => `${Routes.dashboard}${shop}`,
        label: 'sidebar-nav-item-dashboard',
        icon: 'DashboardIcon',
        permissions: adminOwnerAndStaffOnly,
      },
    ],
  },
  product: {
    placeholder: '/product-placeholder.svg',
  },
  avatar: {
    placeholder: '/avatar-placeholder.svg',
  },
};
