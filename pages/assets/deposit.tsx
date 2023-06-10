import { CloseOutlined, CopyOutlined, WalletOutlined } from "@ant-design/icons";
import { Button, Card, Result, Skeleton, Tooltip, Typography } from "antd";
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
          title={<Typography>Wallet Address</Typography>}
          extra={
            <Button type="text" onClick={() => onClose()}>
              <CloseOutlined />
            </Button>
          }
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {[...data, ...data].map((wallet, _index) => (
              <div
                key={`wallet-${_index}`}
                style={{ display: "flex", gap: "0.5rem" }}
              >
                <WalletOutlined />
                <Typography style={{ paddingRight: "8px" }}>
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
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
