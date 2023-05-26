import {
  ExcludeSetting,
  excludeSettingState,
} from '~/recoil/atoms/excludeSetting';
import { updateBadgeText } from '~/utils/helpers';
import { EmptyProps } from '~/utils/types';

import { SettingFilled } from '@ant-design/icons';
import { Button, Divider, Space, Switch, Typography } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot, useRecoilState } from 'recoil';

import './popup.css';

const { Text } = Typography;

const App: React.FC<EmptyProps> = () => {
  const [excludeSetting, setExcludeSetting] =
    useRecoilState<ExcludeSetting>(excludeSettingState);

  // const [_checked, setChecked] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const { autoReplace } = await chrome.storage.sync.get('autoReplace');
  //       console.log(`🎈 autoReplace get: ${autoReplace}`);
  //       setChecked(autoReplace);
  //     } catch (e) {
  //       console.log(`🎈 autoReplace get error: ${e}`);
  //       await Promise.all([
  //         chrome.storage.sync.set({ autoReplace: false }),
  //         updateBadgeText(window.location.href, false),
  //       ]);
  //       setChecked(false);
  //     }
  //   })();
  // }, []);

  // const handleChange = async (checked: boolean) => {
  //   console.log(`🎈 autoReplace set: ${checked}`);

  //   await chrome.storage.sync.set({ autoReplace: checked });
  //   setChecked(checked);

  //   try {
  //     const activeTabs: chrome.tabs.Tab[] = await chrome.tabs.query({
  //       active: true,
  //       lastFocusedWindow: true,
  //     }); // active: 열린 탭

  //     console.log(`🎈 activeTabs: ${JSON.stringify(activeTabs)}`);

  //     // TODO: multiple windows ..
  //     const tab = activeTabs[0];
  //     if (!tab.url || !tab.id || !tab.url.match(String.raw`https?://*`)) {
  //       return;
  //     }

  //     // XXX: how can I send with chrome.tabs.sendMessage? I think this is the problem
  //     await chrome.runtime.sendMessage({
  //       url: tab.url,
  //       on: checked,
  //     });
  //   } catch (e) {
  //     console.log(`🎈 sendMessage error: ${e}`);
  //   }
  // };

  const clearStorage = () => {
    console.log(`🎈 clear storage`);
    chrome.storage.sync.clear();
  };

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Space align="center">
        <Switch
          checked={excludeSetting.autoReplaceEnabled}
          onChange={(checked, event) => {
            console.log(`🎈 checked: ${checked}`);
            setExcludeSetting({
              ...excludeSetting,
              autoReplaceEnabled: checked,
            });
            updateBadgeText(checked);
          }}
        />
        <Text>Automatically replace all links</Text>
      </Space>
      <Text mark>⚠️ Refresh page after change</Text>
      <Space style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          icon={<SettingFilled />}
          onClick={() => {
            chrome.runtime.openOptionsPage();
          }}
        >
          Options
        </Button>
      </Space>
    </Space>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(
  <RecoilRoot>
    <App />
  </RecoilRoot>,
);
