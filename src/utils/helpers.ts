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

  // Loop through each link and modify its href attribute
  for (let i = 0; i < links.length; i++) {
    const href = links[i].getAttribute('href');
    if (
      !href ||
      href.startsWith(constants.MENLO_URL) ||
      constants.BLACKLISTED_PREFIXES.some((prefix) =>
        href.startsWith(prefix),
      ) ||
      isExcluded(href, excludeType, excludePatterns)
    ) {
      console.log('** skipping', href);
      continue;
    }

    // TODO: deal with relative paths
    // ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a
    let newHref = '';
    if (href.startsWith('/')) {
      newHref = `${constants.MENLO_URL}${href}`;
    } else {
      newHref = `${constants.MENLO_URL}/${href}`;
    }

    links[i].setAttribute('href', newHref);
  }
};

export const updateBadgeText = async (on: boolean) => {
  const text = on ? 'ON' : '';
  const bgColor = on ? '#3266E3' : '#CCCCCC';

  await Promise.all([
    chrome.action.setBadgeText({ text }),
    chrome.action.setBadgeBackgroundColor({ color: bgColor }),
  ]);
};
