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
  Card,
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
      // Update icon preview with resolved URL
      if (initialData.iconUrl) {
        setIconPreview(resolveUploadUrl(initialData.iconUrl));
      }
    }
  }, [initialData, form]);

  const handleIconChange = (info: any) => {
    const file = info.file.originFileObj || info.file;
    if (file) {
      setIconFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
    return false; // Prevent auto upload
  };

  const handleSubmit = async (values: any) => {
    // Parse categories from comma-separated string
    const categories = values.categories
      ? values.categories
          .split(',')
          .map((c: string) => c.trim())
          .filter((c: string) => c)
      : [];

    const data = {
      ...values,
      categories,
      genesisDate: values.genesisDate?.toISOString() || null,
      icon: iconFile || undefined,
    };

    await onSubmit(data);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        isActive: true,
        peggedPercentage: 10,
      }}
    >
      <Row gutter={24}>
        {/* Left Column - Core Details */}
        <Col xs={24} lg={12}>
          <Card title="Token Details" size="small">
            <Form.Item
              name="ticker"
              label="Ticker Symbol"
              rules={[
                { required: true, message: 'Ticker is required' },
                { max: 10, message: 'Max 10 characters' },
                {
                  pattern: /^[A-Z0-9]+$/i,
                  message: 'Only letters and numbers allowed',
                },
              ]}
            >
              <Input
                placeholder="MIT"
                style={{ textTransform: 'uppercase' }}
                disabled={isEdit}
              />
            </Form.Item>

            <Form.Item
              name="name"
              label="Token Name"
              rules={[{ required: true, message: 'Name is required' }]}
            >
              <Input placeholder="MIT Coin" />
            </Form.Item>

            <Form.Item label="Icon">
              <Space direction="vertical" size={8} style={{ width: '100%' }}>
                {iconPreview && (
                  <Image
                    src={iconPreview}
                    alt="Icon preview"
                    width={64}
                    height={64}
                    style={{ borderRadius: 8, objectFit: 'cover' }}
                  />
                )}
                <Upload
                  accept="image/*"
                  showUploadList={false}
                  beforeUpload={() => false}
                  onChange={handleIconChange}
                >
                  <Button icon={<UploadOutlined />}>
                    {iconPreview ? 'Change Icon' : 'Upload Icon'}
                  </Button>
                </Upload>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  PNG, JPG, SVG. Max 2MB.
                </Text>
              </Space>
            </Form.Item>

            <Form.Item
              name="isActive"
              label="Active"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Card>

          <Card title="Price Pegging" size="small" style={{ marginTop: 16 }}>
            <Form.Item
              name="peggedToAsset"
              label="Reference Token"
              rules={[{ required: true, message: 'Reference token is required' }]}
            >
              <Select
                placeholder="Select reference token"
                showSearch
                optionFilterProp="label"
                options={referenceTokens.map((t) => ({
                  value: t.symbol,
                  label: `${t.symbol} - ${t.name}`,
                }))}
              />
            </Form.Item>

            <Form.Item
              name="peggedPercentage"
              label="Price Percentage"
              rules={[
                { required: true, message: 'Percentage is required' },
              ]}
              extra="Token price = Reference token price × (percentage / 100)"
            >
              <InputNumber
                min={0.0001}
                max={1000}
                step={0.1}
                precision={4}
                style={{ width: '100%' }}
                addonAfter="%"
              />
            </Form.Item>
          </Card>
        </Col>

        {/* Right Column - Additional Info */}
        <Col xs={24} lg={12}>
          <Card title="Marketing Info (Optional)" size="small">
            <Form.Item name="description" label="Description">
              <TextArea
                rows={4}
                placeholder="Enter token description..."
                maxLength={2000}
                showCount
              />
            </Form.Item>

            <Form.Item
              name="categories"
              label="Categories"
              extra="Comma-separated (e.g., Education, College, DeFi)"
            >
              <Input placeholder="Education, College, DeFi" />
            </Form.Item>

            <Form.Item name="genesisDate" label="Genesis Date">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Card>

          <Card title="Links (Optional)" size="small" style={{ marginTop: 16 }}>
            <Form.Item name="website" label="Website">
              <Input placeholder="https://example.edu" />
            </Form.Item>

            <Form.Item name="whitepaper" label="Whitepaper URL">
              <Input placeholder="https://example.edu/whitepaper.pdf" />
            </Form.Item>

            <Form.Item name="twitter" label="Twitter">
              <Input placeholder="https://twitter.com/example" />
            </Form.Item>

            <Form.Item name="discord" label="Discord">
              <Input placeholder="https://discord.gg/example" />
            </Form.Item>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Space>
        <Button onClick={() => router.back()} icon={<ArrowLeftOutlined />}>
          Cancel
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          icon={<SaveOutlined />}
        >
          {isEdit ? 'Save Changes' : 'Create Token'}
        </Button>
      </Space>
    </Form>
  );
};

