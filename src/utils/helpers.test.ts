import { ExcludeType } from '~/recoil/atoms/excludeSetting';

import { constants } from './constants';
import { getNewHref } from './helpers';

const PREPEND_URL = constants.MENLO_URL;

// XXX: how to test with browser?
// XXX: better test structure?

// About formatting parameters(ex. %p)
// ref: https://jestjs.io/docs/api#1-describeeachtablename-fn-timeout
describe('getNewHref', () => {
  it.each([
    ['domain', ['google.com', 'kakaocorp.com'], false, 'https://google.com', 'https://google.com'],
    ['domain', ['google.com', 'kakaocorp.com'], false, 'https://example.com', `${PREPEND_URL}/https://example.com`],
    ['domain', ['google.com', 'kakaocorp.com'], false, '/test', `${PREPEND_URL}/test`],
    ['domain', ['google.com', 'kakaocorp.com'], true, '/test', '/test'],
    ['domain', ['google.com', 'kakaocorp.com'], true, '/', '/'],
    ['domain', ['google.com', 'kakaocorp.com'], false, '/', '/'],
  ])("(excludeType: %s, excludePatterns: %p, isCurrentPageExcluded: %s) %s => %s", (excludeType: string, excludePatterns: string[], isCurrentPageExcluded: boolean, href: string, result: string) => {
    const newHref = getNewHref(
      href,
      excludeType as ExcludeType,
      excludePatterns,
      isCurrentPageExcluded,
    );
    expect(newHref).toBe(result);
  });
});
