import { Card, Result, Skeleton, Typography } from "antd";
import Table, { ColumnsType } from "antd/es/table";
import useSWR from "swr";
import { ApiOrder } from "types";
import { axiosInstance } from "util/axios";
import { FormatCurrency } from "util/functions";

export function HistoryScreen() {
  const { data, error, isLoading } = useSWR("/orders", (url) =>
    axiosInstance.user.get<ApiOrder[]>(url).then((res) => res.data)
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

  const columns: ColumnsType<ApiOrder> = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, t) => `$${FormatCurrency(t.primeTrustBaseAmount)}`,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_, t) =>
        `${new Date(t.createdAt).toLocaleDateString()} ${new Date(
          t.createdAt
        ).toLocaleTimeString()}`,
    },
  ];

  return (
    <>
      <Card style={{ width: "100%", height: "300px" }}>
        <Typography style={{ fontWeight: "bold" }}>Order History</Typography>
        <div style={{ paddingTop: "2rem" }}>
          <Table
            style={{ width: "100%" }}
            rowKey={(t) => t.primeTrustTxnId}
            bordered
            dataSource={data}
            columns={columns}
          />
        </div>
      </Card>
    </>
  );
}
