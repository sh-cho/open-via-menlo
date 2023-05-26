/* eslint-disable no-script-url */
export const constants = {
  REVISION: 1,
  MENLO_URL: 'https://safe.menlosecurity.com',
  BLACKLISTED_PREFIXES: [
    '#',
    'mailto:',
    'tel:',
    'javascript:',
    'chrome-extension:',
    'chrome:',
  ],
  STORAGE_SETTING_KEY: 'OPEN_VIA_MENLO_EXCLUDE_SETTING',
} as const;
