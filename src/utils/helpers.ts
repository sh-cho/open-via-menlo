import { minimatch } from 'minimatch';

import { ExcludeType } from '~/recoil/atoms/excludeSetting';

import { constants } from './constants';

const getRootDomain = (url: string) =>
  new URL(url).hostname.split('.').slice(-2).join('.');

const isExcluded = (
  url: string,
  excludeType: string,
  excludePatterns: string[],
): boolean => {
  console.log('** isExcluded', url, excludeType, excludePatterns);

  // XXX: better way to do this?
  switch (excludeType) {
    case 'domain':
      // XXX: not accurate!
      return excludePatterns.some((pattern) => url.includes(pattern));

    case 'regex':
      // XXX: It's gonna be slow
      return excludePatterns.some((pattern) => new RegExp(pattern).test(url));

    case 'glob':
      return excludePatterns.some((pattern) => minimatch(url, pattern));

    default:
      return false;
  }
};

// TODO: enhance replace rules
export const prependAllLinks = async (
  excludeType: ExcludeType,
  excludePatterns: string[],
): Promise<void> => {
  // Get all anchor tags on the page
  const links = document.getElementsByTagName('a');
  const isCurrentPageExcluded = isExcluded(
    window.location.href,
    excludeType,
    excludePatterns,
  );

  for (let i = 0; i < links.length; i++) {
    const href = links[i].getAttribute('href');
    if (!href) {
      continue;
    }
    const newHref = getNewHref(
      href,
      excludeType,
      excludePatterns,
      isCurrentPageExcluded,
    );

    links[i].setAttribute('href', newHref);
  }
};

export function getNewHref(
  currentHref: string,
  excludeType: ExcludeType,
  excludePatterns: string[],
  isCurrentPageExcluded: boolean,
): string {
  if (
    !currentHref ||
    currentHref.startsWith(constants.MENLO_URL) ||
    constants.BLACKLISTED_PREFIXES.some((prefix) =>
      currentHref.startsWith(prefix),
    ) ||
    isExcluded(currentHref, excludeType, excludePatterns)
  ) {
    console.log('** skipping (1)', currentHref);
    return currentHref;
  }

  if (currentHref.startsWith('/') && isCurrentPageExcluded) {
    console.log('** skipping (2)', currentHref);
    return currentHref;
  }

  if (currentHref.startsWith('/')) {
    return `${constants.MENLO_URL}${currentHref}`;
  } else {
    return `${constants.MENLO_URL}/${currentHref}`;
  }
}

export const updateBadgeText = async (on: boolean) => {
  const text = on ? 'ON' : '';
  const bgColor = on ? '#3266E3' : '#CCCCCC';

  await Promise.all([
    chrome.action.setBadgeText({ text }),
    chrome.action.setBadgeBackgroundColor({ color: bgColor }),
  ]);
};
