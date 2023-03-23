import { constants } from './constants';
import { isExcluded } from './helpers';

const setDefaultStorage = async () => {
  await Promise.all([
    chrome.storage.sync.set({ autoReplace: false }),
    chrome.storage.sync.set({ excludeUrlPatterns: [] }),
  ]);
};

/*******************************************************************************
 ******************************************************************************/
export const onInstalledListener = async () => {
  setDefaultStorage();

  chrome.contextMenus.create({
    id: 'open-via-menlo',
    title: 'Open via Menlo',
    contexts: ['link', 'page'],
    documentUrlPatterns: ['http://*/*', 'https://*/*'],
    visible: true,
  });
};

export const onClickedListener = async (
  data: chrome.contextMenus.OnClickData
) => {
  if (data.menuItemId === 'open-via-menlo') {
    const newUrl = `${constants.MENLO_URL}/${data.linkUrl || data.pageUrl}`;
    console.log(`💬 Opening ${newUrl}`);
    chrome.tabs.create({ url: newUrl });
  }
};
