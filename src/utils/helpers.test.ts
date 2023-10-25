import { ExcludeType } from '~/recoil/atoms/excludeSetting';

import { constants } from './constants';
import { getNewHref } from './helpers';

const PREPEND_URL = constants.MENLO_URL;

// XXX: how to test with browser?
// XXX: better test structure?

// const CURRENT_URL_EXCLUDED = 'https://google.com';
const CURRENT_URL_NOT_EXCLUDED = 'https://abcde.com';

// About formatting parameters(ex. %p)
// ref: https://jestjs.io/docs/api#1-describeeachtablename-fn-timeout
describe('getNewHref', () => {
  it.each([
    ['domain', ['google.com', 'kakaocorp.com'], true, '/test', '/test'],
    ['domain', ['google.com', 'kakaocorp.com'], true, '/', '/'],
    [
      'domain',
      ['google.com', 'kakaocorp.com'],
      false,
      'https://google.com',
      'https://google.com',
    ],
    [
      'domain',
      ['google.com', 'kakaocorp.com'],
      false,
      'https://example.com',
      `${PREPEND_URL}/https://example.com`,
    ],
    [
      'domain',
      ['google.com', 'kakaocorp.com'],
      false,
      '/',
      `${PREPEND_URL}/${CURRENT_URL_NOT_EXCLUDED}/`,
    ],
    [
      'domain',
      ['google.com', 'kakaocorp.com'],
      false,
      '/test/123',
      `${PREPEND_URL}/${CURRENT_URL_NOT_EXCLUDED}/test/123`,
    ],
    ['domain', ['google.com', 'kakaocorp.com'], false, '#', '#'],
    ['domain', ['google.com', 'kakaocorp.com'], false, '#test', '#test'],
  ])(
    '(excludeType: %s, excludePatterns: %p, isCurrentPageExcluded: %s) %s => %s',
    (
      excludeType: string,
      excludePatterns: string[],
      isCurrentPageExcluded: boolean,
      href: string,
      result: string,
    ) => {
      const newHref = getNewHref(
        href,
        excludeType as ExcludeType,
        excludePatterns,
        isCurrentPageExcluded,
        isCurrentPageExcluded ? undefined : CURRENT_URL_NOT_EXCLUDED,
      );
      expect(newHref).toBe(result);
    },
  );
});
