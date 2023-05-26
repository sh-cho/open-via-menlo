import { constants } from './constants';

const MENU_IDS = {
  OPEN_VIA_MENLO: 'open-via-menlo',
  GO_BACK: 'go-back',
};

export const onInstalledListener = async () => {
  // setDefaultStorage();

  chrome.contextMenus.create({
    id: MENU_IDS.OPEN_VIA_MENLO,
    title: 'Open via Menlo',
    contexts: ['link', 'page'],
    documentUrlPatterns: ['http://*/*', 'https://*/*'],
    visible: true,
  });
  chrome.contextMenus.create({
    id: MENU_IDS.GO_BACK,
    title: 'Go back to normal page',
    contexts: ['page'],
    documentUrlPatterns: [`${constants.MENLO_URL}/*`],
    visible: true,
  });
};

export const onClickedListener = async (
  data: chrome.contextMenus.OnClickData,
) => {
  switch (data.menuItemId) {
    case MENU_IDS.OPEN_VIA_MENLO: {
      const newUrl = `${constants.MENLO_URL}/${data.linkUrl || data.pageUrl}`;
      console.log(`💬 Opening ${newUrl}`);
      chrome.tabs.create({ url: newUrl });
      break;
    }

    case MENU_IDS.GO_BACK: {
      const prevUrl = data.pageUrl?.replace(`${constants.MENLO_URL}/`, '');
      console.log(`💬 Going back to ${prevUrl}`);
      chrome.tabs.update({ url: prevUrl });
      break;
    }

    default:
      break;
  }
};
