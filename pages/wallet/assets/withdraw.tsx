import { CloseOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Form,
  InputNumber,
  Radio,
  Result,
  Skeleton,
  Space,
} from "antd";
import { NotificationContext } from "context/notification";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { ApiAssetWithdraw } from "types";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

export function WithdrawScreen({
  asset,
  onAddWallet,
  onClose,
}: {
  asset: string;
  onAddWallet: () => void;
  onClose: () => void;
}) {
  const [completed, setCompleted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/assets/withdraw/addresses?asset=${asset}`,
    (url) =>
      axiosInstance.user.get<ApiAssetWithdraw[]>(url).then((res) => res.data)
  );

  if (error) {
    return (
      <Result
        style={{ width: "100%" }}
        status="error"
        title="An unexpected error has occurred, please reload the page"
      />
    );
  }

  if (isLoading || !data) {
    return (
      <Card style={{ width: "100%" }}>
        <Skeleton active />
      </Card>
    );
  }

  if (completed) {
    return (
      <Result
        style={{ width: "100%" }}
        status="success"
        title="Disbursement authorization email has been sent to your registered email address"
        extra={
          <Link href="/wallet/transfers">
            <Button type="primary">Check Transfer Status</Button>
          </Link>
        }
      />
    );
  }

  const onFinish = async (data: {
    assetTransferMethodId: string;
    unitCount: number;
  }) => {
    setLoading(true);

    await axiosInstance.user
      .post<{
        message: string;
      }>("/api/assets/withdraw", {
        asset: asset,
        assetTransferMethodId: data.assetTransferMethodId,
        unitCount: data.unitCount,
      })
      .then((res) => {
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
        setCompleted(true);
        setLoading(false);
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  const remove = async (id: string) => {
    setLoading(true);

    await axiosInstance.user
      .delete<{
        message: string;
      }>(`/api/assets/withdraw/addresses/${id}`)
      .then((res) => {
        mutate();
        notification.success({ message: res.data.message });
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title={`Withdraw ${asset}`}
          extra={
            <Button type="text" onClick={() => onClose()}>
              <CloseOutlined />
            </Button>
          }
        >
          {data.length === 0 && (
            <div>
              <Space direction="vertical" size={16}>
                <Alert
                  message="In order for you to withdraw assets from your account, you will need to register your external wallet details with us."
                  type="info"
                />
                <Button
                  htmlType="submit"
                  style={{ width: "100%" }}
                  onClick={() => onAddWallet()}
                >
                  Add Wallet
                </Button>
              </Space>
            </div>
          )}
          {data.length > 0 && (
            <Form disabled={loading} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Select Destination Address"
                name="assetTransferMethodId"
                required
                rules={[
                  {
                    required: true,
                    message: "Please select your wallet!",
                  },
                ]}
              >
                <Radio.Group>
                  <Space direction="vertical">
                    {data.map((item, index) => (
                      <div key={`bank-${index}`}>
                        <Radio key={`bank-${index}`} value={item.id}>
                          {item.walletAddress}
                        </Radio>
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          type="link"
                          onClick={() => remove(item.id)}
                        />
                      </div>
                    ))}
                    <div>
                      <Button
                        size="small"
                        style={{ color: "var(--color-primary)" }}
                        type="link"
                        icon={<PlusOutlined />}
                        onClick={onAddWallet}
                      >
                        Add new address
                      </Button>
                    </div>
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                label="Amount"
                required
                name="unitCount"
                rules={[{ required: true, message: "Please enter amount!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  title="Amount"
                  placeholder="Enter amount to withdraw"
                  precision={6}
                  step={0.1}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "100%" }}
                >
                  Submit Request
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </>
  );
}
