import { LeftOutlined } from "@ant-design/icons";
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
import { AxiosError } from "axios";
import Footer from "components/footer";
import Header from "components/header";
import { NotificationContext } from "context/notification";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import useSWR from "swr";
import { ApiAssetWithdraw, assetsList } from "types";
import { axiosInstance } from "util/axios";

export function Page() {
  const router = useRouter();
  const [completed, setCompleted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);

  const asset = assetsList.find(
    (item) => item.assetId === router.query.assetId
  );

  const { data, error, isLoading } = useSWR(
    `/api/assets/withdraw/addresses?assetId=${router.query.assetId}`,
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

  const onFinish = (data: {
    assetTransferMethodId: string;
    unitCount: number;
  }) => {
    setLoading(true);

    axiosInstance.user
      .post<{
        message: string;
      }>("/api/assets/withdraw", {
        assetId: router.query.assetId,
        assetTransferMethodId: data.assetTransferMethodId,
        unitCount: data.unitCount,
      })
      .then((res) => {
        notification.success(res.data.message);
        setCompleted(true);
        setLoading(false);
      })
      .catch((err: AxiosError<{ errors?: string[] }>) => {
        if (err.response?.data.errors?.length) {
          err.response.data.errors.forEach((err) => notification.error(err));
        } else {
          notification.error({
            content: err.message ?? "Unknown error, please try again",
          });
        }
        setLoading(false);
      });
  };

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <Card
          title={
            <Space>
              <Link href="/assets">
                <Button type="text">
                  <LeftOutlined />
                </Button>
              </Link>
              <Typography>Withdraw {asset?.name}</Typography>
            </Space>
          }
          extra={
            <Link href={`/assets/add-wallet?assetId=${router.query.assetId}`}>
              <Button>Add wallet</Button>
            </Link>
          }
        >
          {data.length === 0 && (
            <div>
              <Space direction="vertical">
                <Typography>
                  In order for you to withdraw assets from your account, you
                  will need to register your external wallet details with us.
                </Typography>
                <Link
                  href={`/assets/add-wallet?assetId=${router.query.assetId}`}
                >
                  Add wallet
                </Link>
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
                  prefix="$"
                  title="Amount"
                  placeholder="Enter amount"
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

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Deposit fiat | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <div className="container">{page}</div>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
