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
import {
  getUserTransactions,
  updateTransactionStatus,
  TransactionItem,
} from '../../../services/api/admin';

const { Text } = Typography;

interface UserTransactionsProps {
  userId: string;
}

export const UserTransactions: React.FC<UserTransactionsProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [typeFilter, setTypeFilter] = useState<'DEPOSIT' | 'WITHDRAWAL' | undefined>();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [selectedTx, setSelectedTx] = useState<TransactionItem | null>(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserTransactions(userId, {
        page,
        limit,
        type: typeFilter,
        status: statusFilter,
      });
      setTransactions(response.transactions);
      setTotal(response.total);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [userId, page, limit, typeFilter, statusFilter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleStatusChange = async (txId: string, newStatus: string) => {
    try {
      await updateTransactionStatus(
        userId,
        txId,
        newStatus as 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED',
      );
      message.success(`Status updated to ${newStatus}`);
      fetchTransactions();
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: 'orange',
    PROCESSING: 'blue',
    COMPLETED: 'green',
    FAILED: 'red',
    CANCELLED: 'default',
  };

  const typeColors: Record<string, string> = {
    DEPOSIT: 'green',
    WITHDRAWAL: 'red',
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 120,
      render: (id: string | null, record: TransactionItem) => (
        <Text code style={{ fontSize: 11 }}>
          {(id || record.id).slice(0, 8)}
        </Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => <Tag color={typeColors[type]}>{type}</Tag>,
    },
    {
      title: 'Method',
      dataIndex: 'method',
      key: 'method',
      width: 80,
      render: (method: string) => method?.toUpperCase() || '-',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number, record: TransactionItem) => (
        <Text strong type={record.type === 'DEPOSIT' ? 'success' : 'danger'}>
          {record.type === 'DEPOSIT' ? '+' : '-'}${amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (status: string, record: TransactionItem) => (
        <Select
          value={status}
          size="small"
          style={{ width: 120 }}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={[
            { value: 'PENDING', label: 'Pending' },
            { value: 'PROCESSING', label: 'Processing' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'FAILED', label: 'Failed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
        />
      ),
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
      render: (_: any, record: TransactionItem) => (
        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => setSelectedTx(record)} />
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Type"
          allowClear
          style={{ width: 120 }}
          value={typeFilter}
          onChange={(val) => { setTypeFilter(val); setPage(1); }}
          options={[
            { value: 'DEPOSIT', label: 'Deposits' },
            { value: 'WITHDRAWAL', label: 'Withdrawals' },
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
            { value: 'PROCESSING', label: 'Processing' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'FAILED', label: 'Failed' },
            { value: 'CANCELLED', label: 'Cancelled' },
          ]}
        />
        <Button icon={<ReloadOutlined />} onClick={fetchTransactions} loading={loading}>
          Refresh
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={transactions}
        rowKey="id"
        loading={loading}
        size="small"
        pagination={{
          current: page,
          pageSize: limit,
          total,
          showSizeChanger: true,
          showTotal: (t) => `${t} transactions`,
          onChange: (p, l) => { setPage(p); setLimit(l); },
        }}
      />

      <Modal
        title="Transaction Details"
        open={!!selectedTx}
        onCancel={() => setSelectedTx(null)}
        footer={null}
        width={500}
      >
        {selectedTx && (
          <Descriptions column={1} size="small">
            <Descriptions.Item label="ID">{selectedTx.id}</Descriptions.Item>
            <Descriptions.Item label="Transaction ID">{selectedTx.transactionId || '-'}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <Tag color={typeColors[selectedTx.type]}>{selectedTx.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Method">{selectedTx.method?.toUpperCase()}</Descriptions.Item>
            <Descriptions.Item label="Amount">${selectedTx.amount.toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={statusColors[selectedTx.status]}>{selectedTx.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Reference">{selectedTx.reference || '-'}</Descriptions.Item>
            <Descriptions.Item label="Created">{new Date(selectedTx.createdAt).toLocaleString()}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};
