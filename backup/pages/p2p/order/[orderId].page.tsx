import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  InfoCircleFilled,
  LoadingOutlined,
} from "@ant-design/icons";
import { Button, Card, Result, Space, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import LoadingScreen from "components/loading-screen";
import { ExchangeContextProvider } from "context/exchange-context";
import { NotificationContext } from "context/notification";
import { UserAuthContextProvider } from "context/protect-route-user";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import useSWR from "swr";
import { OrderBaseType, OrderState, P2POrderRecord } from "types";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";
import { FormatCurrency } from "util/functions";

import { P2POrderTransactions } from "./transactions";

function ViewOrder(props: { orderId: string }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { api: notification } = React.useContext(NotificationContext);

  const { data, error, mutate } = useSWR(
    `/p2p-order/${props.orderId}`,
    (url: string) =>
      axiosInstance.user.get<P2POrderRecord>(url).then((res) => res.data),
    { refreshInterval: 15_000 }
  );

  const RequestCancel = async () => {
    setLoading(true);
    await axiosInstance.user
      .delete(`/p2p-order/${props.orderId}`)
      .then((res) => {
        notification.success({
          message: res.data.message,
          placement: "bottomLeft",
        });
        setTimeout(() => {
          mutate();
        }, 3_000);
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  if (error) {
    return <Result status="error" title="Unable to load order details" />;
  }

  if (!data) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="text"
            onClick={() =>
              router.push(
                `/p2p/${data.assetCode}-${
                  data.base.type === OrderBaseType.Asset
                    ? data.base.code
                    : "USD"
                }`
              )
            }
          >
            <ArrowLeftOutlined />
            <span style={{ paddingLeft: "8px" }}>Go back</span>
          </Button>
          {data.status === OrderState.Open && (
            <Button
              type="text"
              danger
              loading={loading}
              onClick={RequestCancel}
            >
              Cancel Order
            </Button>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Typography style={{ flexGrow: 1, fontSize: "12px" }}>
            {data.orderType}{" "}
            <b>
              {data.quantity} {data.assetCode}{" "}
            </b>
            at{" "}
            <b>
              {data.price}{" "}
              {data.base.type === OrderBaseType.Fiat
                ? data.base.currency
                : data.base.code}{" "}
            </b>
            at {dayjs(data.createdAt).format("MMMM DD, YYYY")} at{" "}
            {dayjs(data.createdAt).format("hh:mm A")}
          </Typography>
          <Typography style={{ fontSize: "12px" }}>
            Order ID: {data.id}
          </Typography>
        </div>
        <Card style={{ textAlign: "center" }}>
          <Space direction="vertical" size="small">
            {data.status === OrderState.Open && (
              <div style={{ fontSize: "64px", color: "#14A9FF" }}>
                <LoadingOutlined />
              </div>
            )}
            {data.status === OrderState.Closed && (
              <div style={{ fontSize: "64px", color: "#777777" }}>
                <InfoCircleFilled />
              </div>
            )}
            {data.status === OrderState.Completed && (
              <div style={{ fontSize: "64px", color: "#00B81D" }}>
                <CheckCircleOutlined />
              </div>
            )}
            <Typography.Title level={4}>
              {data.status === OrderState.Open
                ? "Matching your order"
                : data.status === OrderState.Closed
                ? "Order Closed"
                : "Trade completed!"}
            </Typography.Title>
            {data.reason && (
              <Typography style={{ color: "orange" }}>{data.reason}</Typography>
            )}
            <Typography style={{ fontSize: "12px" }}>
              Order created on {dayjs(data.createdAt).format("MMMM DD, YYYY")}{" "}
              at {dayjs(data.createdAt).format("hh:mm A")}
            </Typography>
            <Typography.Title level={4}>
              Sold {FormatCurrency(data.totalQuantity)} {data.assetCode} for{" "}
              {FormatCurrency(data.totalPrice)}{" "}
              {data.base.type === OrderBaseType.Fiat
                ? data.base.currency
                : data.base.code}{" "}
              (Average Price: {FormatCurrency(data.averagePrice)})
            </Typography.Title>
            <Typography>
              Remaining quantity: {FormatCurrency(data.quantityRemaining)}{" "}
              {data.assetCode}
            </Typography>
          </Space>
        </Card>
        <P2POrderTransactions order={data} />
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
