import { minimatch } from 'minimatch';

import { constants } from './constants';
import type { ExcludeType } from './types';

/** Drops empty lines and `#` comments. */
export const getActivePatterns = (patterns: string[]): string[] =>
  patterns.map((p) => p.trim()).filter((p) => p && !p.startsWith('#'));

const matches = (
  url: string,
  excludeType: ExcludeType,
  pattern: string,
): boolean => {
  switch (excludeType) {
    case 'domain':
      // XXX: not accurate (substring match)
      return url.includes(pattern);
    case 'regex':
      try {
        return new RegExp(pattern).test(url);
      } catch {
        return false; // ignore invalid regex
      }
    case 'glob':
      return minimatch(url, pattern);
    default:
      return false;
  }
};

export const isExcluded = (
  url: string,
  excludeType: ExcludeType,
  patterns: string[],
): boolean => patterns.some((pattern) => matches(url, excludeType, pattern));

export function getNewHref(
  href: string,
  excludeType: ExcludeType,
  excludePatterns: string[],
  isCurrentPageExcluded: boolean,
  origin: string | undefined, // need only if `isCurrentPageExcluded` is false
): string {
  if (
    !href ||
    href.startsWith(constants.MENLO_URL) ||
    constants.BLACKLISTED_PREFIXES.some((prefix) => href.startsWith(prefix)) ||
    isExcluded(href, excludeType, excludePatterns)
  ) {
    return href;
  }

  // absolute link
  if (!href.startsWith('/')) {
    return `${constants.MENLO_URL}/${href}`;
  }

  // relative link on a non-excluded page
  if (!isCurrentPageExcluded) {
    return `${constants.MENLO_URL}${origin ? `/${origin}` : ''}${href}`;
  }

  return href;
}

/** Rewrites `href` of given anchors based on current `location`. */
export const prependLinks = (
  anchors: Iterable<HTMLAnchorElement>,
  excludeType: ExcludeType,
  excludePatterns: string[],
): void => {
  const isCurrentPageExcluded = isExcluded(
    window.location.href,
    excludeType,
    excludePatterns,
  );

  for (const anchor of anchors) {
    const href = anchor.getAttribute('href');
    if (!href) continue;

    const newHref = getNewHref(
      href,
      excludeType,
      excludePatterns,
      isCurrentPageExcluded,
      window.location.origin,
    );
    if (newHref !== href) anchor.setAttribute('href', newHref);
  }
};

export const updateBadgeText = async (on: boolean) => {
  await Promise.all([
    chrome.action.setBadgeText({ text: on ? 'ON' : '' }),
    chrome.action.setBadgeBackgroundColor({
      color: on ? '#3266E3' : '#CCCCCC',
    }),
  ]);
};
