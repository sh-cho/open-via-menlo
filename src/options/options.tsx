import {
  ClockCircleFilled,
  GithubFilled,
  TagFilled,
  ToolFilled,
} from '@ant-design/icons';
import {
  Alert,
  Col,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Tag,
  Typography,
} from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';

import { useExcludeSetting } from '~/hooks/useExcludeSetting';
import type { EmptyProps } from '~/utils/types';

const { Text, Title } = Typography;
const { TextArea } = Input;

export const Options: React.FC<EmptyProps> = () => {
  const [excludeSetting, setExcludeSetting] = useExcludeSetting();
  const [form] = Form.useForm();

  return (
    <>
      <Row>
        <Col span={4} />
        <Col span={16}>
          <Title level={2}>Open-via-menlo options</Title>
          <Alert
            title={
              <span>
                All data is automatically stored in{' '}
                <Text code>
                  <a href="https://developer.chrome.com/docs/extensions/reference/storage/#storage-areas">
                    chrome.storage.sync
                  </a>
                </Text>
              </span>
            }
            type="info"
            showIcon
          />
        </Col>
      </Row>
      <Divider />
      <Form
        layout="horizontal"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
      >
        <Form.Item
          label="Exclude Type"
          extra={
            <ul>
              <li>
                domain: ex) <Text code>google.com</Text>
              </li>
              <li>
                regex: ex) <Text code>.*(google|kakaocorp).com.*</Text>
              </li>
              <li>
                glob: ex) <Text code>http?://*.kakaocorp.com/*</Text>
              </li>
            </ul>
          }
        >
          <Radio.Group
            value={excludeSetting.excludeType}
            onChange={(e) => {
              setExcludeSetting({
                ...excludeSetting,
                excludeType: e.target.value,
              });
            }}
          >
            <Radio.Button value="domain">Domain</Radio.Button>
            <Radio.Button value="regex">Regex</Radio.Button>
            <Radio.Button value="glob">Glob</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Exclude patterns"
          extra={
            <ul>
              <li>One per line</li>
              <li>
                Line starting with <Text code>#</Text> or empty line will be
                ignored
              </li>
            </ul>
          }
        >
          <TextArea
            value={excludeSetting.excludePatterns.join('\n')}
            rows={20}
            onChange={(e) => {
              setExcludeSetting({
                ...excludeSetting,
                excludePatterns: e.target.value.split('\n'),
              });
            }}
          />
        </Form.Item>
      </Form>
      <Divider />
      <Row>
        <Col span={4} />
        <Col span={16} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {import.meta.env.DEV && (
            <>
              <Tag icon={<ToolFilled />} color="error">
                dev
              </Tag>
              <Tag icon={<GithubFilled />}>{__COMMIT_HASH__}</Tag>
              <Tag icon={<ClockCircleFilled />}>{__COMMIT_DATE__}</Tag>
            </>
          )}
          <a
            href={`https://github.com/sh-cho/open-via-menlo/releases/tag/v${__APP_VERSION__}`}
          >
            <Tag icon={<TagFilled />} color="processing">
              v{__APP_VERSION__}
            </Tag>
          </a>
        </Col>
      </Row>
    </>
  );
};

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
);
