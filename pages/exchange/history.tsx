import {
  Button,
  Card,
  Descriptions,
  Modal,
  Result,
  Skeleton,
  Table,
  Typography,
} from "antd";
import { ColumnsType } from "antd/es/table";
import { BalanceContext } from "context/balance";
import React from "react";
import useSWR from "swr";
import { ApiOrder } from "types";
import { axiosInstance } from "util/axios";
import { FormatCurrency, FormatPrice } from "util/functions";

export function HistoryScreen() {
  const { data: balances } = React.useContext(BalanceContext);
  const [receipt, setReceipt] = React.useState("");

  const { data, error, isLoading, mutate } = useSWR("/orders", (url) =>
    axiosInstance.user.get<ApiOrder[]>(url).then((res) => res.data)
  );

  React.useEffect(() => {
    mutate();
  }, [balances.find((bx) => bx.code === "USD")?.unit]);

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
      title: "Asset",
      dataIndex: "asset",
      key: "asset",
      render: (_, t) => (
        <div>
          <img
            alt={t.assetCode}
            src={`/asset/${t.assetCode.toLowerCase()}.png`}
            width={24}
            height={24}
          />
          {t.assetName}
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "amount",
      key: "amount",
      render: (_, t) => (
        <div style={{ color: t.type === "buy" ? "#4ddc44" : "#dc4446" }}>
          {t.unit} {t.assetCode}
        </div>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (_, t) => `${FormatCurrency(FormatPrice(t.pricePerUnit, 2))} USD`,
    },
    {
      title: "Transaction Value",
      dataIndex: "price",
      key: "price",
      render: (_, t) => `${FormatCurrency(FormatPrice(t.total, 2))} USD`,
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, t) => (
        <>
          <Modal
            open={receipt === t.id}
            onCancel={() => setReceipt("")}
            title={`${t.assetCode} ${t.type === "buy" ? "Purchased" : "Sold"}`}
          >
            <div style={{ paddingTop: "2rem" }}>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Order ID">{t.id}</Descriptions.Item>
                <Descriptions.Item label="Date & Time">
                  {new Date(t.createdAt).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label="Amount">
                  {t.unit} {t.assetCode}
                </Descriptions.Item>
                <Descriptions.Item label="Rate">
                  {FormatCurrency(t.pricePerUnit.toFixed(2))} USD
                </Descriptions.Item>
                <Descriptions.Item label="Total Value">
                  {FormatCurrency(t.totalValue.toFixed(2))} USD
                </Descriptions.Item>
                <Descriptions.Item label="Maker Fee (0.50%)">
                  {FormatCurrency(t.makerFee.toFixed(2))} USD
                </Descriptions.Item>
                <Descriptions.Item label="Platform Fee (0.49%)">
                  {FormatCurrency(t.platformFee.toFixed(2))} USD
                </Descriptions.Item>
                <Descriptions.Item label="Transaction Value">
                  {FormatCurrency(t.total.toFixed(2))} USD
                </Descriptions.Item>
              </Descriptions>
            </div>
          </Modal>
          <Button onClick={() => setReceipt(t.id)}>View</Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Card style={{ width: "100%", border: 0 }}>
        <Typography style={{ fontWeight: "bold" }}>Order History</Typography>
        <div style={{ paddingTop: "2rem" }}>
          <Table
            size="small"
            style={{ width: "100%", minHeight: "300px" }}
            pagination={{
              pageSize: 5,
            }}
            rowKey={(t) => t.id}
            dataSource={data}
            columns={columns}
            locale={{ emptyText: "No Records" }}
          />
        </div>
      </Card>
    </>
  );
}
