import {
  ExcludeSetting,
  excludeSettingState,
} from '~/recoil/atoms/excludeSetting';
import { EmptyProps } from '~/utils/types';

import { Alert, Col, Divider, Form, Input, Radio, Row, Typography } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RecoilRoot, useRecoilState } from 'recoil';

const { Text, Title } = Typography;
const { TextArea } = Input;

export const Options: React.FC<EmptyProps> = () => {
  // recoil
  const [excludeSetting, setExcludeSetting] =
    useRecoilState<ExcludeSetting>(excludeSettingState);

  // antd form
  const [form] = Form.useForm();

  return (
    <>
      <Row>
        <Col span={4} />
        <Col span={16}>
          <Title level={2}>Open-via-menlo options</Title>
          <Alert
            message={
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
              console.log(`excludeType: ${e.target.value}`);
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
              const patterns = e.target.value.split('\n');
              console.log(`excludePatterns: ${patterns}`);
              setExcludeSetting({
                ...excludeSetting,
                excludePatterns: patterns,
              });
            }}
          />
        </Form.Item>
      </Form>
    </>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <RecoilRoot>
      <Options />
    </RecoilRoot>
  </React.StrictMode>,
);
