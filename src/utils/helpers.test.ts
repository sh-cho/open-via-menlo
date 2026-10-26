import { describe, expect, it } from 'vitest';

import { constants } from './constants';
import {
  getActivePatterns,
  getNewHref,
  isExcluded,
  prependLinks,
} from './helpers';
import type { ExcludeType } from './types';

const MENLO = constants.MENLO_URL;
const ORIGIN = 'https://abcde.com';
const DOMAINS = ['google.com', 'kakaocorp.com'];

describe('getActivePatterns', () => {
  it('drops empty lines and comments, trims', () => {
    expect(
      getActivePatterns(['', '  ', '# comment', ' google.com ', 'a.com']),
    ).toEqual(['google.com', 'a.com']);
  });
});

describe('isExcluded', () => {
  it.each<[ExcludeType, string[], string, boolean]>([
    ['domain', DOMAINS, 'https://www.google.com/a', true],
    ['domain', DOMAINS, 'https://example.com', false],
    ['domain', [], 'https://google.com', false],
    [
      'regex',
      ['.*(google|kakaocorp)\\.com.*'],
      'https://mail.google.com',
      true,
    ],
    ['regex', ['^https://exact\\.com$'], 'https://exact.com/path', false],
    ['regex', ['(invalid'], 'https://google.com', false],
    [
      'glob',
      ['https://*.kakaocorp.com/**'],
      'https://www.kakaocorp.com/a/b',
      true,
    ],
    ['glob', ['https://*.kakaocorp.com/**'], 'https://example.com/a', false],
  ])('%s %j: %s => %s', (type, patterns, url, expected) => {
    expect(isExcluded(url, type, patterns)).toBe(expected);
  });
});

describe('getNewHref', () => {
  it.each<[string, boolean, string]>([
    // [href, isCurrentPageExcluded, expected]
    ['https://example.com', false, `${MENLO}/https://example.com`],
    ['https://example.com', true, `${MENLO}/https://example.com`],
    ['https://google.com', false, 'https://google.com'],
    ['/', false, `${MENLO}/${ORIGIN}/`],
    ['/test/123', false, `${MENLO}/${ORIGIN}/test/123`],
    ['/test', true, '/test'],
    ['/', true, '/'],
    [`${MENLO}/https://example.com`, false, `${MENLO}/https://example.com`],
    ['', false, ''],
    ...constants.BLACKLISTED_PREFIXES.map((p): [string, boolean, string] => [
      `${p}x`,
      false,
      `${p}x`,
    ]),
  ])(
    '%s (current page excluded: %s) => %s',
    (href, isCurrentPageExcluded, expected) => {
      expect(
        getNewHref(href, 'domain', DOMAINS, isCurrentPageExcluded, ORIGIN),
      ).toBe(expected);
    },
  );

  it('omits origin when not given', () => {
    expect(getNewHref('/a', 'domain', [], false, undefined)).toBe(`${MENLO}/a`);
  });

  it('respects regex / glob exclusion', () => {
    expect(
      getNewHref('https://a.google.com', 'regex', ['google'], false, ORIGIN),
    ).toBe('https://a.google.com');
    expect(
      getNewHref(
        'https://a.google.com/x',
        'glob',
        ['https://*.google.com/**'],
        false,
        ORIGIN,
      ),
    ).toBe('https://a.google.com/x');
  });
});

const anchors = (...hrefs: (string | null)[]) =>
  hrefs.map((href) => {
    const a = document.createElement('a');
    if (href !== null) a.setAttribute('href', href);
    return a;
  });

describe('prependLinks', () => {
  it('rewrites hrefs based on current location', () => {
    const links = anchors(
      'https://example.com',
      '/path',
      'https://google.com',
      '#top',
      null,
    );
    prependLinks(links, 'domain', DOMAINS);
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      `${MENLO}/https://example.com`,
      `${MENLO}/${ORIGIN}/path`,
      'https://google.com',
      '#top',
      null,
    ]);
  });

  it('keeps relative links when current page is excluded', () => {
    const links = anchors('/path', 'https://example.com');
    prependLinks(links, 'domain', ['abcde.com']);
    expect(links.map((a) => a.getAttribute('href'))).toEqual([
      '/path',
      `${MENLO}/https://example.com`,
    ]);
  });

  it('is idempotent', () => {
    const links = anchors('https://example.com');
    prependLinks(links, 'domain', []);
    prependLinks(links, 'domain', []);
    expect(links[0]!.getAttribute('href')).toBe(`${MENLO}/https://example.com`);
  });
});
