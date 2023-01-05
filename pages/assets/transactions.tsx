import { Card, Result, Skeleton, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import useSWR from "swr";
import { ApiAssetTransaction } from "types";
import { axiosInstance } from "util/axios";
import { FormatCurrency } from "util/functions";

export function AssetTransactions() {
  const { data, error, isLoading } = useSWR("/api/assets/transactions", (url) =>
    axiosInstance.user.get<ApiAssetTransaction[]>(url).then((res) => res.data)
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

  const columns: ColumnsType<ApiAssetTransaction> = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, t) => `${FormatCurrency(t.unitCount)}`,
      sorter: (a, b) => a.unitCount - b.unitCount,
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
        `${new Date(t.createdAt).toLocaleDateString()} ${new Date(
          t.createdAt
        ).toLocaleTimeString()}`,
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
        Transaction History
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
