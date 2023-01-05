import { Button, Card, Result, Skeleton, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import Link from "next/link";
import useSWR from "swr";
import { ApiAssetSummary, AssetListItem, assetsList } from "types";
import { axiosInstance } from "util/axios";

export function AssetBalance() {
  const { data, error, isLoading } = useSWR("/api/assets/totals", (url) =>
    axiosInstance.user.get<ApiAssetSummary[]>(url).then((res) => res.data)
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

  const columns: ColumnsType<AssetListItem> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, t) => t.name,
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (_, t) =>
        `${data.find((f) => f.assetId === t.assetId)?.settled ?? 0}`,
    },
    {
      title: "Balance Cold",
      dataIndex: "balanceCold",
      key: "balanceCold",
      render: (_, t) =>
        `${data.find((f) => f.assetId === t.assetId)?.settledCold ?? 0}`,
    },
    {
      title: "Balance Hot",
      dataIndex: "balanceHot",
      key: "balanceHot",
      render: (_, t) =>
        `${data.find((f) => f.assetId === t.assetId)?.settledHot ?? 0}`,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, t) => (
        <Space>
          <Link href={`/assets/deposit?assetId=${t.assetId}`}>
            <Button>Deposit</Button>
          </Link>
          <Link href={`/assets/withdraw?assetId=${t.assetId}`}>
            <Button>Withdraw</Button>
          </Link>
        </Space>
      ),
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
        Assets
      </Typography>
      <Table
        style={{ width: "100%" }}
        rowKey={(t) => t.assetId}
        bordered
        dataSource={assetsList}
        columns={columns}
        scroll={{ x: 800 }}
      />
    </>
  );
}
