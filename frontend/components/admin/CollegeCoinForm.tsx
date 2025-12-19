import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  DatePicker,
  Upload,
  Button,
  Space,
  Typography,
  Row,
  Col,
  Image,
  Divider,
} from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import { DemoCollegeCoin, ReferenceToken } from '../../services/api/admin';
import { resolveUploadUrl } from '../../services/api/college-coins';

const { TextArea } = Input;
const { Text } = Typography;

interface CollegeCoinFormProps {
  initialData?: DemoCollegeCoin;
  referenceTokens: ReferenceToken[];
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
  isEdit?: boolean;
}

export const CollegeCoinForm: React.FC<CollegeCoinFormProps> = ({
  initialData,
  referenceTokens,
  onSubmit,
  loading = false,
  isEdit = false,
}) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(
    initialData?.iconUrl ? resolveUploadUrl(initialData.iconUrl) : null
  );

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        genesisDate: initialData.genesisDate ? dayjs(initialData.genesisDate) : null,
        categories: initialData.categories?.join(', ') || '',
      });
      if (initialData.iconUrl) {
        setIconPreview(resolveUploadUrl(initialData.iconUrl));
      }
    }
  }, [initialData, form]);

  const handleIconChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setIconPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    return false;
  };

  const handleSubmit = async (values: any) => {
    const categories = values.categories
      ? values.categories.split(',').map((c: string) => c.trim()).filter((c: string) => c)
      : [];

    await onSubmit({
      ...values,
      categories,
      genesisDate: values.genesisDate?.toISOString() || null,
      icon: iconFile || undefined,
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{ isActive: true, peggedPercentage: 10 }}
    >
      <Row gutter={48}>
        <Col xs={24} lg={12}>
          <Divider orientation="left">Token Details</Divider>
          
          <Form.Item
            name="ticker"
            label="Ticker Symbol"
            rules={[
              { required: true, message: 'Required' },
              { max: 10, message: 'Max 10 chars' },
              { pattern: /^[A-Z0-9]+$/i, message: 'Letters/numbers only' },
            ]}
          >
            <Input placeholder="MIT" style={{ textTransform: 'uppercase' }} disabled={isEdit} />
          </Form.Item>

          <Form.Item name="name" label="Token Name" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="MIT Coin" />
          </Form.Item>

          <Form.Item label="Icon">
            <Space>
              {iconPreview && (
                <Image src={iconPreview} alt="Icon" width={48} height={48} style={{ borderRadius: 6, objectFit: 'cover' }} />
              )}
              <Upload accept="image/*" showUploadList={false} beforeUpload={() => false} onChange={handleIconChange}>
                <Button icon={<UploadOutlined />}>{iconPreview ? 'Change' : 'Upload'}</Button>
              </Upload>
            </Space>
          </Form.Item>

          <Form.Item name="isActive" label="Active" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Divider orientation="left">Price Pegging</Divider>

          <Form.Item name="peggedToAsset" label="Reference Token" rules={[{ required: true, message: 'Required' }]}>
            <Select
              placeholder="Select token"
              showSearch
              optionFilterProp="label"
              options={referenceTokens.map((t) => ({ value: t.symbol, label: `${t.symbol} - ${t.name}` }))}
            />
          </Form.Item>

          <Form.Item
            name="peggedPercentage"
            label="Price Percentage"
            rules={[{ required: true, message: 'Required' }]}
            extra="Token price = Reference × (percentage / 100)"
          >
            <InputNumber min={0.0001} max={1000} step={0.1} precision={4} style={{ width: '100%' }} addonAfter="%" />
          </Form.Item>
        </Col>

        <Col xs={24} lg={12}>
          <Divider orientation="left">Marketing (Optional)</Divider>

          <Form.Item name="description" label="Description">
            <TextArea rows={3} placeholder="Token description..." maxLength={2000} showCount />
          </Form.Item>

          <Form.Item name="categories" label="Categories" extra="Comma-separated">
            <Input placeholder="Education, College, DeFi" />
          </Form.Item>

          <Form.Item name="genesisDate" label="Genesis Date">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Divider orientation="left">Links (Optional)</Divider>

          <Form.Item name="website" label="Website">
            <Input placeholder="https://example.edu" />
          </Form.Item>

          <Form.Item name="whitepaper" label="Whitepaper">
            <Input placeholder="https://example.edu/whitepaper.pdf" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="twitter" label="Twitter">
                <Input placeholder="@handle" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="discord" label="Discord">
                <Input placeholder="discord.gg/..." />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      <Divider />

      <Space>
        <Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading} icon={<SaveOutlined />}>
          {isEdit ? 'Save Changes' : 'Create Token'}
        </Button>
      </Space>
    </Form>
  );
};
