import { SettingFilled } from '@ant-design/icons';
import { Button, Space, Switch, Typography } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot, useRecoilState } from 'recoil';

import {
  ExcludeSetting,
  excludeSettingState,
} from '~/recoil/atoms/excludeSetting';
import { updateBadgeText } from '~/utils/helpers';
import { EmptyProps } from '~/utils/types';

import './popup.css';

const { Text } = Typography;

const App: React.FC<EmptyProps> = () => {
  const [excludeSetting, setExcludeSetting] =
    useRecoilState<ExcludeSetting>(excludeSettingState);

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <Space align="center">
        <Switch
          checked={excludeSetting.autoReplaceEnabled}
          onChange={(checked, _event) => {
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
