import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CheckOutlined,
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
import {
  OrderBaseType,
  OrderState,
  P2POrderRecord,
  P2PTransaction,
} from "types";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";

function ViewOrder(props: { orderId: string }) {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { api: notification } = React.useContext(NotificationContext);

  const { data, error, mutate } = useSWR(
    `/p2p-order/${props.orderId}`,
    (url: string) =>
      axiosInstance.user
        .get<{ order: P2POrderRecord; transactions: P2PTransaction[] }>(url)
        .then((res) => res.data),
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
                `/p2p/${data.order.assetCode}-${
                  data.order.base.type === OrderBaseType.Asset
                    ? data.order.base.code
                    : "USD"
                }`
              )
            }
          >
            <ArrowLeftOutlined />
            <span style={{ paddingLeft: "8px" }}>Go back</span>
          </Button>
          {data.order.status === OrderState.Open && (
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
            at {dayjs(data.order.createdAt).format("MMMM DD, YYYY")} at{" "}
            {dayjs(data.order.createdAt).format("hh:mm A")}
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
              <div style={{ fontSize: "64px", color: "#777777" }}>
                <InfoCircleFilled />
              </div>
            )}
            {data.order.status === OrderState.Completed && (
              <div style={{ fontSize: "64px", color: "#00B81D" }}>
                <CheckCircleOutlined />
              </div>
            )}
            <Typography.Title level={4}>
              {data.order.status === OrderState.Open
                ? "Matching your order"
                : data.order.status === OrderState.Closed
                ? "Order Closed"
                : "Trade completed!"}
            </Typography.Title>
            {data.order.reason && (
              <Typography style={{ color: "orange" }}>
                {data.order.reason}
              </Typography>
            )}
            <Typography style={{ fontSize: "12px" }}>
              Order created on{" "}
              {dayjs(data.order.createdAt).format("MMMM DD, YYYY")} at{" "}
              {dayjs(data.order.createdAt).format("hh:mm A")}
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
                      {tx.executedQuantity} {data.order.assetCode} for a total
                      of {tx.executedPrice}{" "}
                      {data.order.base.type === OrderBaseType.Fiat
                        ? data.order.base.currency
                        : data.order.base.code}
                    </Typography>
                    <Typography style={{ fontSize: "12px" }}>
                      {dayjs(tx.createdAt).format("MMMM DD, YYYY")} at{" "}
                      {dayjs(tx.createdAt).format("hh:mm A")}
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