import { CloseOutlined, CopyOutlined, WalletOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  List,
  Result,
  Skeleton,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { NotificationContext } from "context/notification";
import React from "react";
import useSWR from "swr";
import { axiosInstance } from "util/axios";

export function DepositScreen({
  asset,
  onClose,
}: {
  asset: string;
  onClose: () => void;
}) {
  const { api: notification } = React.useContext(NotificationContext);
  const { data, error, isLoading } = useSWR(
    `/api/assets/wallet-address?asset=${asset}`,
    (url) => axiosInstance.user.get<string[]>(url).then((res) => res.data)
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

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title={<Typography>Deposit Address</Typography>}
          extra={
            <Button type="text" onClick={() => onClose()}>
              <CloseOutlined />
            </Button>
          }
        >
          <List>
            {data.map((wallet, _index) => (
              <List.Item
                key={`wallet-${_index}`}
                style={{ display: "flex", gap: "0.5rem" }}
              >
                <WalletOutlined style={{ paddingRight: "8px" }} />
                <Typography style={{ marginInlineEnd: "auto" }}>
                  {wallet}
                </Typography>
                <a
                  onClick={() => {
                    window.navigator.clipboard.writeText(wallet);
                    notification.success({
                      message: "wallet address copied",
                      placement: "bottomLeft",
                    });
                  }}
                >
                  <Tooltip title="copy">
                    <CopyOutlined />
                  </Tooltip>
                </a>
              </List.Item>
            ))}
          </List>
        </Card>
        <Space
          direction="vertical"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <Alert
            showIcon
            type="warning"
            message={
              <>
                Deposit only <b>{asset}</b> to mentioned address. Depositing any
                other asset will result in a loss of funds.
              </>
            }
          />
          <Alert
            showIcon
            type="info"
            message="Assets usually arrive within a few minutes but it could longer in some cases depending on network speed."
          />
        </Space>
      </div>
    </>
  );
}
