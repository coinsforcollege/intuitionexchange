import React, { useState } from 'react';
import {
  Descriptions,
  Tag,
  Space,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Empty,
  Divider,
  Alert,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { FullAdminUser, updateKycStatus } from '../../../services/api/admin';

const { Text, Title } = Typography;
const { TextArea } = Input;

interface UserKycProps {
  user: FullAdminUser;
  onRefresh: () => void;
}

export const UserKyc: React.FC<UserKycProps> = ({ user, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [form] = Form.useForm();

  const statusColors: Record<string, string> = {
    PENDING: 'orange',
    SUBMITTED: 'blue',
    APPROVED: 'green',
    REJECTED: 'red',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <ClockCircleOutlined />,
    SUBMITTED: <ExclamationCircleOutlined />,
    APPROVED: <CheckCircleOutlined />,
    REJECTED: <CloseCircleOutlined />,
  };

  const handleStatusChange = async (values: { reviewNotes?: string }) => {
    if (!pendingStatus) return;

    setLoading(true);
    try {
      await updateKycStatus(user.id, {
        status: pendingStatus,
        reviewNotes: values.reviewNotes,
      });
      message.success(`KYC status updated to ${pendingStatus}`);
      setModalVisible(false);
      form.resetFields();
      setPendingStatus(null);
      onRefresh();
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const openStatusModal = (status: 'APPROVED' | 'REJECTED') => {
    setPendingStatus(status);
    setModalVisible(true);
  };

  if (!user.kyc) {
    return (
      <Empty description="No KYC record - user hasn't started verification" />
    );
  }

  const kyc = user.kyc;

  return (
    <div>
      {/* Status Section */}
      <Space align="center" size="middle" style={{ marginBottom: 16 }}>
        <Title level={5} style={{ margin: 0 }}>KYC Status:</Title>
        <Tag color={statusColors[kyc.status]} icon={statusIcons[kyc.status]} style={{ fontSize: 14 }}>
          {kyc.status}
        </Tag>
        <Text type="secondary">Step {kyc.currentStep} / 4</Text>
      </Space>

      {kyc.status === 'SUBMITTED' && (
        <Alert
          message="Awaiting Review"
          type="info"
          showIcon
          style={{ marginBottom: 16 }}
          action={
            <Space>
              <Button type="primary" size="small" onClick={() => openStatusModal('APPROVED')}>Approve</Button>
              <Button danger size="small" onClick={() => openStatusModal('REJECTED')}>Reject</Button>
            </Space>
          }
        />
      )}

      {kyc.status === 'APPROVED' && (
        <Alert message="KYC Approved" type="success" showIcon style={{ marginBottom: 16 }} />
      )}

      {kyc.status === 'REJECTED' && (
        <Alert
          message="KYC Rejected"
          description={kyc.reviewNotes || 'No reason provided'}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
          action={<Button size="small" onClick={() => openStatusModal('APPROVED')}>Reconsider</Button>}
        />
      )}

      <Divider titlePlacement="start">Personal Details</Divider>
      <Descriptions column={2} size="small">
        <Descriptions.Item label="First Name">{kyc.firstName || '-'}</Descriptions.Item>
        <Descriptions.Item label="Middle Name">{kyc.middleName || '-'}</Descriptions.Item>
        <Descriptions.Item label="Last Name">{kyc.lastName || '-'}</Descriptions.Item>
        <Descriptions.Item label="Date of Birth">
          {kyc.dateOfBirth ? new Date(kyc.dateOfBirth).toLocaleDateString() : '-'}
        </Descriptions.Item>
      </Descriptions>

      <Divider titlePlacement="start">Address</Divider>
      <Descriptions column={2} size="small">
        <Descriptions.Item label="Street 1" span={2}>{kyc.street1 || '-'}</Descriptions.Item>
        <Descriptions.Item label="Street 2" span={2}>{kyc.street2 || '-'}</Descriptions.Item>
        <Descriptions.Item label="City">{kyc.city || '-'}</Descriptions.Item>
        <Descriptions.Item label="Region">{kyc.region || '-'}</Descriptions.Item>
        <Descriptions.Item label="Postal Code">{kyc.postalCode || '-'}</Descriptions.Item>
        <Descriptions.Item label="Country">{kyc.country || '-'}</Descriptions.Item>
      </Descriptions>

      <Divider titlePlacement="start">Verification</Divider>
      <Descriptions column={2} size="small">
        <Descriptions.Item label="Veriff Session">
          {kyc.veriffSessionId ? (
            <Text copyable style={{ fontSize: 11 }}>{kyc.veriffSessionId.slice(0, 20)}...</Text>
          ) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="Veriff Status">{kyc.veriffStatus || '-'}</Descriptions.Item>
        <Descriptions.Item label="Veriff Reason" span={2}>{kyc.veriffReason || '-'}</Descriptions.Item>
      </Descriptions>

      {(kyc.reviewedAt || kyc.reviewNotes) && (
        <>
          <Divider titlePlacement="start">Review History</Divider>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="Reviewed By">{kyc.reviewedBy || '-'}</Descriptions.Item>
            <Descriptions.Item label="Reviewed At">
              {kyc.reviewedAt ? new Date(kyc.reviewedAt).toLocaleString() : '-'}
            </Descriptions.Item>
            <Descriptions.Item label="Notes">{kyc.reviewNotes || '-'}</Descriptions.Item>
          </Descriptions>
        </>
      )}

      <Divider titlePlacement="start">Manual Override</Divider>
      <Space>
        <Select
          placeholder="Change Status"
          style={{ width: 150 }}
          onChange={(val) => openStatusModal(val as 'APPROVED' | 'REJECTED')}
          options={[
            { value: 'APPROVED', label: 'Approve' },
            { value: 'REJECTED', label: 'Reject' },
          ]}
        />
        <Text type="secondary">Manually override KYC status</Text>
      </Space>

      <Modal
        title={`${pendingStatus === 'APPROVED' ? 'Approve' : 'Reject'} KYC`}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields(); setPendingStatus(null); }}
        footer={null}
      >
        <Form form={form} onFinish={handleStatusChange} layout="vertical">
          <Form.Item
            name="reviewNotes"
            label={pendingStatus === 'REJECTED' ? 'Rejection Reason' : 'Notes (optional)'}
            rules={pendingStatus === 'REJECTED' ? [{ required: true, message: 'Required' }] : []}
          >
            <TextArea rows={3} placeholder={pendingStatus === 'REJECTED' ? 'Reason...' : 'Notes...'} />
          </Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading} danger={pendingStatus === 'REJECTED'}>
              {pendingStatus === 'APPROVED' ? 'Approve' : 'Reject'}
            </Button>
            <Button onClick={() => setModalVisible(false)}>Cancel</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
};
