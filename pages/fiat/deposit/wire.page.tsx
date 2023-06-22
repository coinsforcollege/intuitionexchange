import { CloseOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Card,
  Descriptions,
  List,
  Result,
  Skeleton,
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
          title={<Typography>Wire instructions</Typography>}
          extra={
            <Link href="/fiat/deposit" style={{ color: "inherit" }}>
              <Button type="text">
                <CloseOutlined />
              </Button>
            </Link>
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
        <Card style={{ marginTop: "1rem" }}>
          <List>
            <List.Item>
              View{" "}
              <Link href="/fiat/deposit">
                <b>Alternative Methods</b>
              </Link>{" "}
              to deposit funds.
            </List.Item>
            <List.Item>
              If you have already wired funds to the above details kindly wait
              up to 1 business day for it to be processed.
            </List.Item>
            <List.Item>
              Please note that weekends can delay the deposit processing.
            </List.Item>
            <List.Item>
              Visit{" "}
              <Link href="/wallet/transfers">
                <b>Transfer History</b>
              </Link>{" "}
              page to check status of your past deposits and withdrawals.
            </List.Item>
            <List.Item>
              <Link
                href="https://support.intuitionexchange.com"
                target="_blank"
              >
                <b>Contact Support</b>
              </Link>{" "}
              if you feel there has been a delay in the settlement of funds into
              your InTuition account.
            </List.Item>
          </List>
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
