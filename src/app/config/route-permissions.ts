import { UiMode } from './menu';

export const ROUTE_PERMISSIONS: Record<string, UiMode[]> = {
  '/app/dashboard': [
    'OWNER',
    'ADMIN',
    'USER',
    'ADMIN_SUPPLIER',
    'USER_SUPPLIER',
    'USER_PERMISSION',
    'USER_PERMISSION_SUPPLIER',
  ],

  '/app/companies': ['OWNER'],

  '/app/company': ['ADMIN', 'ADMIN_SUPPLIER'],

  '/app/my-schedule': ['USER_PERMISSION', 'USER_PERMISSION_SUPPLIER'],

  '/app/bookings': [
    'OWNER',
    'ADMIN',
    'ADMIN_SUPPLIER',
    'USER_SUPPLIER',
    'USER_PERMISSION_SUPPLIER',
  ],

  '/app/availabilities': [
    'OWNER',
    'ADMIN',
    'ADMIN_SUPPLIER',
    'USER_SUPPLIER',
    'USER_PERMISSION_SUPPLIER',
  ],

  '/app/services': [
    'OWNER',
    'ADMIN',
    'ADMIN_SUPPLIER',
    'USER_SUPPLIER',
    'USER_PERMISSION_SUPPLIER',
  ],

  '/app/users': ['OWNER', 'ADMIN', 'ADMIN_SUPPLIER'],

  '/app/customers': [
    'OWNER',
    'ADMIN',
    'ADMIN_SUPPLIER',
    'USER',
    'USER_SUPPLIER',
    'USER_PERMISSION',
    'USER_PERMISSION_SUPPLIER',
  ],

  '/app/payments': [
    'OWNER',
    'ADMIN',
    'ADMIN_SUPPLIER',
    'USER',
    'USER_SUPPLIER',
    'USER_PERMISSION',
    'USER_PERMISSION_SUPPLIER',
  ],

  '/app/profile': [
    'OWNER',
    'ADMIN',
    'ADMIN_SUPPLIER',
    'USER',
    'USER_SUPPLIER',
    'USER_PERMISSION',
    'USER_PERMISSION_SUPPLIER',
  ],

  '/app/settings': [
    'OWNER',
    'ADMIN',
    'ADMIN_SUPPLIER',
    'USER',
    'USER_SUPPLIER',
    'USER_PERMISSION',
    'USER_PERMISSION_SUPPLIER',
  ],
};