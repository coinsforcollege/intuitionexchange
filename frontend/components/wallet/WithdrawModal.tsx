'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Button, message, theme, Typography, Select, Space, Empty, Divider } from 'antd';
import { BankOutlined, ArrowRightOutlined, PlusOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { createWithdrawal, getBankAccounts, type BankAccount } from '@/services/api/fiat';
import { fontWeights } from '@/theme/themeConfig';

const { useToken } = theme;
const { Text } = Typography;

interface WithdrawModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  availableBalance: number;
}

export default function WithdrawModal({ visible, onClose, onSuccess, availableBalance }: WithdrawModalProps) {
  const [form] = Form.useForm();
  const { token } = useToken();
  const [loading, setLoading] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  // Load bank accounts when modal opens
  useEffect(() => {
    if (visible) {
      loadBankAccounts();
    } else {
      form.resetFields();
    }
  }, [visible]);

  const loadBankAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const accounts = await getBankAccounts();
      setBankAccounts(accounts);
      if (accounts.length > 0 && !selectedAccountId) {
        setSelectedAccountId(accounts[0].id);
        form.setFieldsValue({ bankAccountId: accounts[0].id });
      }
    } catch (error: any) {
      message.error('Failed to load bank accounts');
    } finally {
      setLoadingAccounts(false);
    }
  };


  const handleSubmit = async (values: { amount: number; bankAccountId: string }) => {
    if (!values.bankAccountId) {
      message.error('Please select a bank account');
      return;
    }

    setLoading(true);
    try {
      await createWithdrawal(values.bankAccountId, values.amount);
      message.success('Withdrawal request submitted successfully');
      onSuccess();
      onClose();
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || 'Failed to create withdrawal');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title={
        <Space>
          <BankOutlined />
          <span>Withdraw Funds</span>
        </Space>
      }
      width={600}
      styles={{
        body: {
          padding: token.paddingXL,
        },
      }}
    >
      <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ amount: undefined }}
        >
          {/* Available Balance */}
          <div style={{
            padding: token.paddingMD,
            backgroundColor: token.colorBgLayout,
            borderRadius: token.borderRadius,
            marginBottom: token.marginLG,
          }}>
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>Available Balance</Text>
            <div style={{ fontSize: token.fontSizeHeading3, fontWeight: fontWeights.bold, color: token.colorText }}>
              ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Bank Account Selection */}
          <Form.Item
            label="Bank Account"
            name="bankAccountId"
            rules={[{ required: true, message: 'Please select a bank account' }]}
          >
            {loadingAccounts ? (
              <div style={{ textAlign: 'center', padding: token.paddingLG }}>
                <Text type="secondary">Loading bank accounts...</Text>
              </div>
            ) : bankAccounts.length === 0 ? (
              <Empty
                description="No bank accounts added"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              >
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    onClose();
                    window.location.href = '/portfolio/bank-accounts/add';
                  }}
                >
                  Add Bank Account
                </Button>
              </Empty>
            ) : (
              <Select
                placeholder="Select a bank account"
                value={selectedAccountId || undefined}
                onChange={(value) => {
                  setSelectedAccountId(value);
                  form.setFieldsValue({ bankAccountId: value });
                }}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      block
                      onClick={() => {
                        onClose();
                        window.location.href = '/portfolio/bank-accounts/add';
                      }}
                      style={{ textAlign: 'left' }}
                    >
                      Add New Bank Account
                    </Button>
                  </>
                )}
              >
                {bankAccounts.map((account) => (
                  <Select.Option key={account.id} value={account.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: fontWeights.medium }}>
                          {account.accountName}
                        </div>
                        <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
                          •••• {account.last4} {account.isVerified && <CheckCircleOutlined style={{ color: token.colorSuccess }} />}
                        </Text>
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>

          {/* Amount */}
          <Form.Item
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: 'Please enter an amount' },
              { type: 'number', min: 10, message: 'Minimum withdrawal is $10' },
              { type: 'number', max: availableBalance, message: 'Amount exceeds available balance' },
            ]}
          >
            <InputNumber
              prefix="$"
              style={{ width: '100%' }}
              placeholder="0.00"
              min={10}
              max={availableBalance}
              precision={2}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          {/* Info */}
          <div style={{
            padding: token.paddingMD,
            backgroundColor: token.colorInfoBg,
            borderRadius: token.borderRadius,
            marginBottom: token.marginLG,
          }}>
            <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
              <BankOutlined /> Withdrawals typically take 2-3 business days to process. Instant payouts are available for verified accounts (additional fee applies).
            </Text>
          </div>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              icon={<ArrowRightOutlined />}
              disabled={bankAccounts.length === 0}
            >
              Request Withdrawal
            </Button>
          </Form.Item>
        </Form>
    </Modal>
  );
}

