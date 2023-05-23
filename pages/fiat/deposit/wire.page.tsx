import { LeftOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  Result,
  Skeleton,
  Space,
  Typography,
} from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import Link from "next/link";
import React, { ReactElement } from "react";
import useSWR from "swr";
import { ApiFiatWireInstructions } from "types";
import { axiosInstance } from "util/axios";

export function Page() {
  const { data, error, isLoading } = useSWR(
    "/api/fiat/wire/instructions",
    (url) =>
      axiosInstance.user
        .get<ApiFiatWireInstructions>(url)
        .then((res) => res.data)
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
              <Link href="/fiat/deposit">
                <Button type="text">
                  <LeftOutlined />
                </Button>
              </Link>
              <Typography>Wire instructions</Typography>
            </Space>
          }
        >
          <div style={{ paddingBottom: "1rem" }}>
            <Alert
              message="Please include the provided payment reference code in the comment or
            memo section. An absence of this reference may prevent the deposit
            from being processed automatically."
              type="warning"
            />
          </div>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Account Number">
              {data.accountNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Routing Number">
              {data.routingNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Bank Address">
              {data.bankAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Bank Phone">
              {data.bankPhone}
            </Descriptions.Item>
            <Descriptions.Item label="Beneficiary Address">
              {data.beneficiaryAddress}
            </Descriptions.Item>
            <Descriptions.Item label="creditTo">
              {data.creditTo}
            </Descriptions.Item>
            <Descriptions.Item label="Depository Bank Name">
              {data.depositoryBankName}
            </Descriptions.Item>
            <Descriptions.Item label="Reference">
              <b>{data.reference}</b>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Deposit wire instructions | Intuition Exchange</title>
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
