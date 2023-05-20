import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Card,
  Form,
  InputNumber,
  Radio,
  Result,
  Skeleton,
  Space,
  Typography,
} from "antd";
import { NotificationContext } from "context/notification";
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

  const { data, error, isLoading } = useSWR(
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
        title="Withdraw requested"
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
              <Space direction="vertical">
                <Typography>
                  In order for you to withdraw assets from your account, you
                  will need to register your external wallet details with us.
                </Typography>
                <a onClick={() => onAddWallet()}>Add wallet</a>
              </Space>
            </div>
          )}
          {data.length > 0 && (
            <Form disabled={loading} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Select wallet"
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
                      <Radio key={`bank-${index}`} value={item.id}>
                        {item.walletAddress}
                      </Radio>
                    ))}
                    <a onClick={() => onAddWallet()}>Add wallet</a>
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
                  placeholder="0.0"
                />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "100%" }}
                >
                  Withdraw
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </>
  );
}
