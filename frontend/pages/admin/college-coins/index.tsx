import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Tag,
  Typography,
  Card,
  Image,
  Switch,
  Upload,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  EditOutlined,
  DeleteOutlined,
  ImportOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import {
  getCollegeCoins,
  deleteCollegeCoin,
  updateCollegeCoin,
  importCollegeCoins,
  DemoCollegeCoin,
} from '../../../services/api/admin';
import { resolveUploadUrl } from '../../../services/api/college-coins';

const { Text } = Typography;

// CSV template for download
const CSV_TEMPLATE = `ticker,name,peggedToAsset,peggedPercentage,iconUrl,description,website,whitepaper,twitter,discord,categories,genesisDate,isActive
MIT,MIT Coin,ETH,10,/api/uploads/media/mit-icon.png,MIT University Token,https://mit.edu,,,MIT|Education|University,2024-01-01,true
STANFORD,Stanford Token,BTC,5,,Stanford University Token,https://stanford.edu,,,Stanford|Education,2024-01-01,true`;

export default function AdminCollegeCoinsPage() {
  const router = useRouter();
  const [coins, setCoins] = useState<DemoCollegeCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [importModalVisible, setImportModalVisible] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    total: number;
    created: number;
    failed: number;
    errors: { row: number; ticker: string; error: string }[];
  } | null>(null);

  const fetchCoins = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getCollegeCoins();
      setCoins(response.coins);
    } catch (error: any) {
      message.error(error.message || 'Failed to fetch college coins');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoins();
  }, [fetchCoins]);

  const handleDelete = (id: string, ticker: string) => {
    Modal.confirm({
      title: `Delete ${ticker}?`,
      content: 'This action cannot be undone. Are you sure you want to delete this demo college coin?',
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteCollegeCoin(id);
          message.success(`${ticker} deleted successfully`);
          fetchCoins();
        } catch (error: any) {
          message.error(error.message || 'Failed to delete');
        }
      },
    });
  };

  const handleToggleActive = async (id: string, ticker: string, isActive: boolean) => {
    try {
      await updateCollegeCoin(id, { isActive });
      message.success(`${ticker} is now ${isActive ? 'active' : 'inactive'}`);
      fetchCoins();
    } catch (error: any) {
      message.error(error.message || 'Failed to update');
    }
  };

  const handleImport = async (file: File) => {
    setImporting(true);
    setImportResult(null);
    try {
      const response = await importCollegeCoins(file);
      setImportResult(response.results);
      if (response.results.created > 0) {
        message.success(response.message);
        fetchCoins();
      } else if (response.results.failed > 0) {
        message.warning('No coins were imported. Check the errors below.');
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to import');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'college-coins-template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatPrice = (price?: number) => {
    if (!price) return '-';
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      width: 60,
      render: (url: string | null, record: DemoCollegeCoin) =>
        url ? (
          <Image
            src={resolveUploadUrl(url)}
            alt={record.ticker}
            width={32}
            height={32}
            style={{ borderRadius: 4 }}
            fallback="/images/default-token.png"
          />
        ) : (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 4,
              background: '#f0f0f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              color: '#999',
            }}
          >
            {record.ticker.substring(0, 2)}
          </div>
        ),
    },
    {
      title: 'Token',
      key: 'token',
      render: (_: any, record: DemoCollegeCoin) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.ticker}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Pegged To',
      key: 'pegged',
      render: (_: any, record: DemoCollegeCoin) => (
        <Space direction="vertical" size={0}>
          <Text>{record.peggedToAsset}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.peggedPercentage}%
          </Text>
        </Space>
      ),
    },
    {
      title: 'Current Price',
      key: 'price',
      render: (_: any, record: DemoCollegeCoin) => (
        <Space direction="vertical" size={0}>
          <Text strong>{formatPrice(record.currentPrice)}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Ref: {formatPrice(record.referencePrice)}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Categories',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) =>
        categories.length > 0 ? (
          <Space wrap size={4}>
            {categories.slice(0, 2).map((cat) => (
              <Tag key={cat} color="blue">{cat}</Tag>
            ))}
            {categories.length > 2 && (
              <Tag>+{categories.length - 2}</Tag>
            )}
          </Space>
        ) : (
          <Text type="secondary">-</Text>
        ),
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean, record: DemoCollegeCoin) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleActive(record.id, record.ticker, checked)}
        />
      ),
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 100,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: DemoCollegeCoin) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => router.push(`/admin/college-coins/${record.id}`)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, record.ticker)}
          />
        </Space>
      ),
    },
  ];

  return (
    <AdminLayout selectedKey="college-coins">
      <Card size="small" style={{ marginBottom: 16, background: 'transparent' }}>
        <Text type="secondary">
          Demo college coins are simulated tokens for <strong>Learner Mode</strong>. 
          They are pegged to real cryptocurrencies and allow users to practice trading without real money.
          These are NOT real tradeable assets.
        </Text>
      </Card>

      <Card size="small" style={{ marginBottom: 16 }}>
        <Space wrap>
          <Link href="/admin/college-coins/new">
            <Button type="primary" icon={<PlusOutlined />}>
              Add Demo Token
            </Button>
          </Link>
          <Button icon={<ImportOutlined />} onClick={() => setImportModalVisible(true)}>
            Import CSV
          </Button>
          <Button icon={<ReloadOutlined />} onClick={fetchCoins}>
            Refresh
          </Button>
        </Space>
      </Card>

      {/* Import Modal */}
      <Modal
        title="Import Demo College Coins from CSV"
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false);
          setImportResult(null);
        }}
        footer={[
          <Button key="template" icon={<DownloadOutlined />} onClick={downloadTemplate}>
            Download Template
          </Button>,
          <Button key="close" onClick={() => {
            setImportModalVisible(false);
            setImportResult(null);
          }}>
            Close
          </Button>,
        ]}
        width={600}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Alert
            type="info"
            showIcon
            message="CSV Format"
            description={
              <div>
                <p style={{ margin: '8px 0 4px' }}>Required columns: <strong>ticker, name, peggedToAsset, peggedPercentage</strong></p>
                <p style={{ margin: '4px 0' }}>Optional columns: iconUrl, description, website, whitepaper, twitter, discord, categories, genesisDate, isActive</p>
                <p style={{ margin: '4px 0' }}>Use <code>|</code> to separate multiple categories (e.g., <code>Education|University</code>)</p>
              </div>
            }
          />

          <Upload.Dragger
            accept=".csv"
            showUploadList={false}
            disabled={importing}
            beforeUpload={(file) => {
              handleImport(file);
              return false;
            }}
          >
            <p className="ant-upload-drag-icon">
              <ImportOutlined style={{ fontSize: 40, color: '#1890ff' }} />
            </p>
            <p className="ant-upload-text">Click or drag CSV file to import</p>
            <p className="ant-upload-hint">Only .csv files are accepted</p>
          </Upload.Dragger>

          {importing && (
            <Alert type="info" message="Importing..." showIcon />
          )}

          {importResult && (
            <div>
              <Alert
                type={importResult.failed === 0 ? 'success' : importResult.created > 0 ? 'warning' : 'error'}
                message={`Imported ${importResult.created} of ${importResult.total} coins`}
                description={
                  importResult.failed > 0 ? (
                    <div style={{ maxHeight: 200, overflow: 'auto', marginTop: 8 }}>
                      <Text strong>Errors ({importResult.failed}):</Text>
                      <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                        {importResult.errors.map((err, i) => (
                          <li key={i}>
                            <Text type="danger">
                              Row {err.row} ({err.ticker}): {err.error}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : undefined
                }
                showIcon
              />
            </div>
          )}
        </Space>
      </Modal>

      <Table
        columns={columns}
        dataSource={coins}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showTotal: (t) => `Total ${t} tokens`,
        }}
      />
    </AdminLayout>
  );
}

