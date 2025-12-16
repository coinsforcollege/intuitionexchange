import { CloseOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Result } from "antd";
import { NotificationContext } from "context/notification";
import React from "react";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

export function AddWalletScreen({
  asset,
  onClose,
}: {
  asset: string;
  onClose: () => void;
}) {
  const [step, setStep] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);

  const onFinish = async (data: { walletId: string }) => {
    setLoading(true);

    await axiosInstance.user
      .post<{
        message: string;
      }>("/api/assets/withdraw/addresses", {
        asset: asset,
        walletId: data.walletId,
      })
      .then((res) => {
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
        setLoading(false);
        setStep(1);
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title="Add wallet"
          extra={
            <Button type="text" onClick={() => onClose()}>
              <CloseOutlined />
            </Button>
          }
        >
          {step === 1 && <Result status="success" title="Wallet added!" />}
          {step === 0 && (
            <Form disabled={loading} layout="vertical" onFinish={onFinish}>
              <Form.Item
                label="Wallet address"
                required
                name="walletId"
                rules={[
                  {
                    required: true,
                    message: "Please enter wallet address!",
                  },
                ]}
              >
                <Input placeholder="Enter wallet address" />
              </Form.Item>
              <Form.Item>
                <Button
                  htmlType="submit"
                  type="primary"
                  style={{ width: "100%" }}
                >
                  Add wallet
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </>
  );
}
