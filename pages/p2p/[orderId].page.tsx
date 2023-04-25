import {
  CheckCircleOutlined,
  CheckOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { Card, Result, Space, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import LoadingScreen from "components/loading-screen";
import { UserAuthContextProvider } from "context/protect-route-user";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import useSWR from "swr";
import {
  OrderBaseType,
  OrderState,
  P2POrderRecord,
  P2PTransaction,
} from "types";
import { axiosInstance } from "util/axios";

import { ExchangeContextProvider } from "./exchange-context";

function ViewOrder(props: { orderId: string }) {
  const { data, error } = useSWR(`/p2p-order/${props.orderId}`, (url: string) =>
    axiosInstance.user
      .get<{ order: P2POrderRecord; transactions: P2PTransaction[] }>(url)
      .then((res) => res.data)
  );

  if (error) {
    return <Result status="error" title="Unable to load order details" />;
  }

  if (!data) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography style={{ flexGrow: 1, fontSize: "12px" }}>
            {data.order.orderType}{" "}
            <b>
              {data.order.quantity} {data.order.assetCode}{" "}
            </b>
            at{" "}
            <b>
              {data.order.price}{" "}
              {data.order.base.type === OrderBaseType.Fiat
                ? data.order.base.currency
                : data.order.base.code}{" "}
            </b>
            at {dayjs(data.order.timestamp).format("MMMM DD, YYYY")} at{" "}
            {dayjs(data.order.timestamp).format("hh:mm A")}
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Order ID: {data.order.id}
          </Typography>
        </div>
        <Card style={{ textAlign: "center" }}>
          <Space direction="vertical" size="small">
            {data.order.status === OrderState.Open && (
              <div style={{ fontSize: "64px", color: "#14A9FF" }}>
                <LoadingOutlined />
              </div>
            )}
            {data.order.status === OrderState.Closed && (
              <div style={{ fontSize: "64px", color: "#00B81D" }}>
                <CheckCircleOutlined />
              </div>
            )}
            <Typography.Title level={4}>
              {data.order.status === OrderState.Open
                ? "Matching your order"
                : "Trade completed!"}
            </Typography.Title>
            <Typography style={{ fontSize: "12px" }}>
              On {dayjs(data.order.timestamp).format("MMMM DD, YYYY")} at{" "}
              {dayjs(data.order.timestamp).format("hh:mm A")}
            </Typography>
          </Space>
        </Card>
        {data.transactions.length > 0 && (
          <Card>
            <Typography.Title level={4} style={{ textAlign: "center" }}>
              Trade details
            </Typography.Title>
            <div>
              {data.transactions.map((tx) => (
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
                      {tx.executedQuantity} {data.order.assetCode} @{" "}
                      {tx.executedPrice}{" "}
                      {data.order.base.type === OrderBaseType.Fiat
                        ? data.order.base.currency
                        : data.order.base.code}
                    </Typography>
                    <Typography style={{ fontSize: "12px" }}>
                      {dayjs(tx.timestamp).format("MMMM DD, YYYY")} at{" "}
                      {dayjs(tx.timestamp).format("hh:mm A")}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </Space>
    </div>
  );
}

export function Page() {
  const router = useRouter();

  if (!router.isReady) {
    return <LoadingScreen />;
  }

  return <ViewOrder orderId={String(router.query.orderId)} />;
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>P2P | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <div className="container">
          <ExchangeContextProvider>{page}</ExchangeContextProvider>
        </div>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
