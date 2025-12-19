import React, { useEffect, useState, useCallback } from 'react';
import {
  Table,
  Space,
  Button,
  Select,
  Tag,
  message,
  Typography,
  Modal,
  Descriptions,
} from 'antd';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { getUserTrades, TradeItem } from '../../../services/api/admin';

const { Text } = Typography;

interface UserTradesProps {
  userId: string;
}

export const UserTrades: React.FC<UserTradesProps> = ({ userId }) => {
  const [trades, setTrades] = useState<TradeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [modeFilter, setModeFilter] = useState<'live' | 'learner' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedTrade, setSelectedTrade] = useState<TradeItem | null>(null);

  const fetchTrades = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserTrades(userId, {
        page,
        limit,
        mode: modeFilter,
        status: statusFilter,
      });
      setTrades(response.trades);
      setTotal(response.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId, page, limit, modeFilter, statusFilter]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  const statusColors: Record<string, string> = {
    PENDING: 'orange',
    COMPLETED: 'green',
    FAILED: 'red',
    CANCELLED: 'default',
  };

  const sideColors: Record<string, string> = {
    BUY: 'green',
    SELL: 'red',
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 100,
      render: (id: string | null, record: TradeItem) => (
        <Space size={4}>
          <Text code style={{ fontSize: 11 }}>
            {(id || record.id).slice(0, 8)}
          </Text>
          {record.isSimulated && <Tag color="blue" style={{ fontSize: 10, padding: '0 4px' }}>DEMO</Tag>}
        </Space>
      ),
    },
    {
      title: 'Pair',
      dataIndex: 'productId',
      key: 'productId',
      width: 100,
      render: (productId: string) => <Text>{productId}</Text>,
    },
    {
      title: 'Side',
      dataIndex: 'side',
      key: 'side',
      width: 70,
      render: (side: string) => <Tag color={sideColors[side]}>{side}</Tag>,
    },
    {
      title: 'Amount',
      key: 'amount',
      width: 150,
      render: (_: any, record: TradeItem) => (
        <Text>
          {record.filledAmount.toFixed(6)} {record.asset} @ ${record.price.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Total',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 100,
      render: (val: number) => <Text strong>${val.toFixed(2)}</Text>,
    },
    {
      title: 'Fee',
      dataIndex: 'platformFee',
      key: 'platformFee',
      width: 80,
      render: (fee: number) => <Text type="secondary">${fee.toFixed(2)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => <Tag color={statusColors[status]}>{status}</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: any, record: TradeItem) => (
        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => setSelectedTrade(record)} />
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          value={modeFilter}
          style={{ width: 120 }}
          onChange={(val) => { setModeFilter(val); setPage(1); }}
          options={[
            { value: 'all', label: 'All Trades' },
            { value: 'live', label: 'Live Only' },
            { value: 'learner', label: 'Demo Only' },
          ]}
        />
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 120 }}
          value={statusFilter}
          onChange={(val) => { setStatusFilter(val); setPage(1); }}
          options={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'FAILED', label: 'Failed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchTrades} loading={loading}>
          Refresh
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={trades}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          showTotal: (t) => `${t} trades`,
          onChange: (p, l) => { setPage(p); setLimit(l); },
        }}
      />

      <Modal
        title="Trade Details"
        open={!!selectedTrade}
        onCancel={() => setSelectedTrade(null)}
        footer={null}
        width={600}
      >
        {selectedTrade && (
          <Descriptions column={2} size="small">
            <Descriptions.Item label="ID" span={2}>{selectedTrade.id}</Descriptions.Item>
            <Descriptions.Item label="Transaction ID" span={2}>
              <Text copyable>{selectedTrade.transactionId || '-'}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Mode">
              {selectedTrade.isSimulated ? <Tag color="blue">Demo</Tag> : <Tag color="green">Live</Tag>}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedTrade.status]}>{selectedTrade.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Product">{selectedTrade.productId}</Descriptions.Item>
            <Descriptions.Item label="Side">
              <Tag color={sideColors[selectedTrade.side]}>{selectedTrade.side}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Requested">{selectedTrade.requestedAmount}</Descriptions.Item>
            <Descriptions.Item label="Filled">{selectedTrade.filledAmount} {selectedTrade.asset}</Descriptions.Item>
            <Descriptions.Item label="Price">${selectedTrade.price.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Total">${selectedTrade.totalValue.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Platform Fee">${selectedTrade.platformFee.toFixed(4)}</Descriptions.Item>
            <Descriptions.Item label="Exchange Fee">${selectedTrade.exchangeFee.toFixed(4)}</Descriptions.Item>
            {selectedTrade.coinbaseOrderId && (
              <Descriptions.Item label="Coinbase Order" span={2}>
                <Text copyable style={{ fontSize: 11 }}>{selectedTrade.coinbaseOrderId}</Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Created">{new Date(selectedTrade.createdAt).toLocaleString()}</Descriptions.Item>
            <Descriptions.Item label="Completed">
              {selectedTrade.completedAt ? new Date(selectedTrade.completedAt).toLocaleString() : '-'}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};
