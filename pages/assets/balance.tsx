import { Button, Card, Result, Skeleton, Space, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import useSWR from "swr";
import { ApiAssetSummary } from "types";
import { axiosInstance } from "util/axios";
import { FormatPrice } from "util/functions";

import { AddWalletScreen } from "./add-wallet";
import { DepositScreen } from "./deposit";
import { WithdrawScreen } from "./withdraw";

function RenderExpand({
  asset,
  expendKey,
  onClose,
  setType,
  type,
}: {
  asset: string;
  expendKey: string;
  onClose: () => void;
  setType: (type: string) => void;
  type: string;
}) {
  if (expendKey !== asset) {
    return <></>;
  }

  if (type === "withdraw") {
    return (
      <WithdrawScreen
        asset={asset}
        onAddWallet={() => setType("add-wallet")}
        onClose={onClose}
      />
    );
  }

  if (type === "add-wallet") {
    return (
      <AddWalletScreen asset={asset} onClose={() => setType("withdraw")} />
    );
  }

  return <DepositScreen asset={asset} onClose={onClose} />;
}

export function AssetBalance() {
  const [expand, setExpand] = React.useState("");
  const [type, setType] = React.useState("withdraw");

  const { data, error, isLoading } = useSWR("/api/assets", (url) =>
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

  const columns: ColumnsType<ApiAssetSummary> = [
    {
      sorter: (a, b) => {
        return a.code.localeCompare(b.code);
      },
      width: "25%",
      title: "Assets",
      dataIndex: "name",
      key: "name",
      render: (_, t) => (
        <>
          <div style={{ display: "flex" }}>
            <img
              onError={(e) => (e.currentTarget.src = "/asset/no-image.png")}
              alt={t.code}
              src={`/asset/${t.code.toLowerCase()}.png`}
              width={24}
              height={24}
              style={{ marginRight: "8px" }}
            />
            <Typography>{t.code}</Typography>
          </div>
        </>
      ),
    },
    {
      sorter: (a, b) => {
        return a.settled - b.settled;
      },
      width: "25%",
      title: "Balance",
      dataIndex: "balance",
      key: "balance",
      render: (_, t) => `${FormatPrice(t.settled)} ${t.code}`,
      align: "center" as "center",
    },
    {
      sorter: (a, b) => {
        return a.currentValue - b.currentValue;
      },
      width: "25%",
      title: "Current Value",
      defaultSortOrder: "descend",
      dataIndex: "currentValue",
      key: "currentValue",
      render: (_, t) =>
        t.currentValue === 0 ? "-" : `${FormatPrice(t.currentValue, 2)} USD`,
      align: "center" as "center",
    },
    {
      width: "25%",
      align: "center" as "center",
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, t) => (
        <Space>
          <Button
            onClick={() => {
              if (t.code === expand && type === "deposit") {
                setExpand("");
                setType("deposit");
              } else {
                setExpand(t.code);
                setType("deposit");
              }
            }}
          >
            Deposit
          </Button>
          <Button
            onClick={() => {
              if (t.code === expand && type === "withdraw") {
                setExpand("");
                setType("withdraw");
              } else {
                setExpand(t.code);
                setType("withdraw");
              }
            }}
          >
            Withdraw
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        style={{ width: "100%" }}
        rowKey={(t) => t.code}
        dataSource={data}
        columns={columns}
        pagination={false}
        scroll={{ x: 800 }}
        expandable={{
          expandedRowKeys: [expand],
          showExpandColumn: false,
          expandedRowRender: (t) => (
            <RenderExpand
              asset={t.code}
              expendKey={expand}
              type={type}
              setType={setType}
              onClose={() => {
                setExpand("");
                setType("deposit");
              }}
            />
          ),
        }}
      />
    </>
  );
}
