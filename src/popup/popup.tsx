import { SettingFilled } from '@ant-design/icons';
import { Button, Space, Switch, Typography } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { useExcludeSetting } from '~/hooks/useExcludeSetting';
import { updateBadgeText } from '~/utils/helpers';
import type { EmptyProps } from '~/utils/types';

import './popup.css';

const { Text } = Typography;

const App: React.FC<EmptyProps> = () => {
  const [excludeSetting, setExcludeSetting] = useExcludeSetting();

  return (
    <Space orientation="vertical" style={{ display: 'flex' }}>
      <Space align="center">
        <Switch
          checked={excludeSetting.autoReplaceEnabled}
          onChange={(checked) => {
            setExcludeSetting({
              ...excludeSetting,
              autoReplaceEnabled: checked,
            });
            void updateBadgeText(checked);
          }}
        />
        <Text>Automatically replace all links</Text>
      </Space>
      <Text mark>⚠️ Refresh page after change</Text>
      <Space style={{ display: 'flex', justifyContent: 'end' }}>
        <Button
          icon={<SettingFilled />}
          onClick={() => {
            void chrome.runtime.openOptionsPage();
          }}
        >
          Options
        </Button>
      </Space>
    </Space>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
