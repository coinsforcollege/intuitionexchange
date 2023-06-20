import { CheckOutlined } from "@ant-design/icons";
import { Card, Result, Typography } from "antd";
import LoadingScreen from "components/loading-screen";
import dayjs from "dayjs";
import React from "react";
import useSWR from "swr";
import { OrderBaseType, P2POrderRecord, P2PTransaction } from "types";
import { axiosInstance } from "util/axios";

interface Props {
  order: P2POrderRecord;
}

export function P2POrderTransactions({ order }: Props) {
  const { data, error } = useSWR(
    `/p2p-order/${order.id}/transactions`,
    (url: string) =>
      axiosInstance.user
        .get<{ data: P2PTransaction[]; limit: number; page: number }>(url)
        .then((res) => res.data),
    { refreshInterval: 15_000 }
  );

  if (error) {
    return <Result status="error" title="Unable to load order details" />;
  }

  if (!data) {
    return <LoadingScreen />;
  }

  return (
    <Card>
      <Typography.Title level={4} style={{ textAlign: "center" }}>
        Transactions
      </Typography.Title>
      {data.data.length === 0 && (
        <div>
          <Typography
            style={{
              paddingTop: "2rem",
              color: "var(--color-text-l3)",
              textAlign: "center",
            }}
          >
            No records to display
          </Typography>
        </div>
      )}
      {data.data.length > 0 && (
        <div>
          {data.data.map((tx) => (
            <div key={tx._id}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  paddingTop: "1rem",
                }}
              >
                <div style={{ fontSize: "24px", color: "#00B81D" }}>
                  <CheckOutlined />
                </div>
                <Typography style={{ flexGrow: 1, fontWeight: "500" }}>
                  {tx.executedQuantity} {order.assetCode} for a total of{" "}
                  {tx.executedPrice}{" "}
                  {order.base.type === OrderBaseType.Fiat
                    ? order.base.currency
                    : order.base.code}
                </Typography>
                <Typography style={{ fontSize: "12px" }}>
                  {dayjs(tx.createdAt).format("MMMM DD, YYYY")} at{" "}
                  {dayjs(tx.createdAt).format("hh:mm A")}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
