import { Card, Result, Skeleton, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import dayjs from "dayjs";
import Head from "next/head";
import { ReactElement } from "react";
import useSWR from "swr";
import { ApiFiatTransaction } from "types";
import { axiosInstance } from "util/axios";
import { FormatCurrency } from "util/functions";

function Page() {
  const { data, error, isLoading } = useSWR("/api/fiat/transactions", (url) =>
    axiosInstance.user.get<ApiFiatTransaction[]>(url).then((res) => res.data)
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

  const columns: ColumnsType<ApiFiatTransaction> = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, t) => `${FormatCurrency(t.amount)} USD`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: "Description",
      dataIndex: "comments",
      key: "comments",
      render: (_, t) => t.comments.join(", "),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, t) =>
        `${dayjs(t.createdAt).format("MMMM DD, YYYY")} at ${dayjs(
          t.createdAt
        ).format("hh:mm A")}`,
      sorter: (a, b) => {
        const first = new Date(a.createdAt);
        const second = new Date(b.createdAt);

        return first.getTime() - second.getTime();
      },
    },
  ];

  return (
    <>
      <Typography
        style={{
          fontWeight: 600,
          fontSize: "16px",
          lineHeight: 1.5,
          marginBottom: "20px",
        }}
      >
        Fiat History
      </Typography>
      <Table
        style={{ width: "100%" }}
        rowKey={(t) => t.id}
        bordered
        dataSource={data}
        columns={columns}
        scroll={{ x: 800 }}
      />
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Fiat History | Intuition Exchange</title>
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
