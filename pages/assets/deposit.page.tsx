import { LeftOutlined } from "@ant-design/icons";
import { Button, Card, Result, Skeleton, Space, Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import useSWR from "swr";
import { ApiAssetDeposit, assetsList } from "types";
import { axiosInstance } from "util/axios";

export function Page() {
  const router = useRouter();
  const { data, error, isLoading } = useSWR(
    `/api/assets/wallet-address?assetId=${router.query.assetId}`,
    (url) =>
      axiosInstance.user.get<ApiAssetDeposit>(url).then((res) => res.data)
  );

  const asset = assetsList.find(
    (item) => item.assetId === router.query.assetId
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
          title={
            <Space>
              <Link href="/assets">
                <Button type="text">
                  <LeftOutlined />
                </Button>
              </Link>
              <Typography>Wallet Address to deposit {asset?.name}</Typography>
            </Space>
          }
        >
          <Typography>{data.walletAddress}</Typography>
        </Card>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Deposit asset | Intuition Exchange</title>
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
