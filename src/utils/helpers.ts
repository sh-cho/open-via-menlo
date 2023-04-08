import minimatch from 'minimatch';

import { constants } from './constants';

export type EmptyProps = Record<string, never>;

export const prependAllLinks = async (): Promise<void> => {
  // Get all anchor tags on the page
  const links = document.getElementsByTagName('a');

  // Loop through each link and modify its href attribute
  for (let i = 0; i < links.length; i++) {
    const href = links[i].getAttribute('href');
    if (
      !href ||
      href.startsWith('#') ||
      href.startsWith(constants.MENLO_URL) ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('javascript:')
    ) {
      continue;
    }

    // TODO: enhance replace rules
    const newHref = href.startsWith('/')
      ? `${constants.MENLO_URL}${href}`
      : `${constants.MENLO_URL}/${href}`;

    links[i].setAttribute('href', newHref);
  }
};

export const isExcluded = async (url: string): Promise<boolean> => {
  try {
    const { excludeUrlPatterns } = await chrome.storage.sync.get(
      'excludeUrlPatterns',
    );
    if (!excludeUrlPatterns || excludeUrlPatterns.length === 0) {
      return false;
    }

    for (const pattern of excludeUrlPatterns) {
      if (minimatch(url, pattern)) {
        return true;
      }
    }

    return false;
  } catch (e) {
    console.error('🔴 [isExcluded]', e);

    return false;
  }
};

export const updateBadgeTextOnTabActions = async (currentTabUrl: string) => {
  console.log('🔎 Updating badge text on tab actions', currentTabUrl);

  const { autoReplace } = await chrome.storage.sync.get('autoReplace');
  await updateBadgeText(currentTabUrl, autoReplace);
};

export const updateBadgeText = async (currentTabUrl: string, on: boolean) => {
  console.log('🔎 Updating badge text', currentTabUrl, on);

  const excluded = await isExcluded(currentTabUrl);
  const text = on ? (excluded ? 'X' : 'ON') : '';
  const bgColor = excluded ? '#CCCCCC' : '#3266E3';
  await chrome.action.setBadgeText({ text });
  await chrome.action.setBadgeBackgroundColor({ color: bgColor });
};
