import { EyeOutlined } from "@ant-design/icons";
import { Button, Card, Modal, Result, Skeleton, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { BalanceContext } from "context/balance";
import React from "react";
import useSWR from "swr";
import { ApiOrder, OrderState, OrderType } from "types";
import { axiosInstance } from "util/axios";
import { PreciseCalculation } from "util/calculation";
import { FormatCurrency } from "util/functions";

import style from "./pairs.module.css";

export function HistoryScreen() {
  const [mode, setMode] = React.useState<OrderState>(OrderState.Closed);
  const { data: balances } = React.useContext(BalanceContext);
  const [receipt, setReceipt] = React.useState("");

  const { data, error, isLoading, mutate } = useSWR(
    `/orders?state=${mode}`,
    (url: string) =>
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
          <Typography style={{ fontSize: "12px" }}>
            <img
              alt={t.assetCode}
              src={`/asset/${t.assetCode.toLowerCase()}.png`}
              width={24}
              height={24}
              style={{ marginRight: "8px" }}
            />
            {t.assetName}
          </Typography>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "amount",
      key: "amount",
      render: (_, t) => (
        <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
          <div
            style={{ color: t.type === OrderType.Buy ? "#4ddc44" : "#dc4446" }}
          >
            {t.unit} {t.assetCode}
          </div>
        </Typography>
      ),
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      render: (_, t) => (
        <Typography style={{ fontSize: "12px" }}>
          {FormatCurrency(PreciseCalculation.round(t.pricePerUnit))} USD
        </Typography>
      ),
    },
    {
      title: "Transaction Value",
      dataIndex: "price",
      key: "price",
      render: (_, t) => (
        <Typography style={{ fontSize: "12px" }}>
          {FormatCurrency(PreciseCalculation.round(t.total))} USD
        </Typography>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (_, t) => (
        <Typography style={{ fontSize: "12px", fontWeight: "bold" }}>
          <div
            style={{
              color: t.type === OrderType.Buy ? "#4ddc44" : "#dc4446",
            }}
          >
            {t.type.toUpperCase()}
          </div>
        </Typography>
      ),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, t) => (
        <>
          <Modal
            width={"400px"}
            open={receipt === t.id}
            onCancel={() => setReceipt("")}
            title={`${t.assetCode} ${
              t.type === OrderType.Buy ? "Purchased" : "Sold"
            }`}
            footer={[]}
          >
            <div style={{ paddingTop: "2rem" }}>
              <div className={style["quote-main"]}>
                <div className={style["quote-container"]}>
                  <div className={style["quote-item"]}>
                    <span>Order ID</span>
                    <span>{t.id}</span>
                  </div>
                  <div className={style["quote-item"]}>
                    <span>Date & Time</span>
                    <span>{new Date(t.createdAt).toLocaleString()}</span>
                  </div>
                  <div className={style["quote-item"]}>
                    <span>Amount</span>
                    <span>
                      {t.unit} {t.assetCode}
                    </span>
                  </div>
                  <div className={style["quote-item"]}>
                    <span>Rate</span>
                    <span>{FormatCurrency(t.pricePerUnit.toFixed(2))} USD</span>
                  </div>
                  <div className={style["quote-item"]}>
                    <span>Total Value</span>
                    <span>{FormatCurrency(t.totalValue.toFixed(2))} USD</span>
                  </div>
                  <div className={style["quote-item"]}>
                    <span>Maker Fee (0.50%)</span>
                    <span>{FormatCurrency(t.makerFee.toFixed(2))} USD</span>
                  </div>
                  <div className={style["quote-item"]}>
                    <span>Platform Fee (0.49%)</span>
                    <span>{FormatCurrency(t.platformFee.toFixed(2))} USD</span>
                  </div>
                  <div className={style["quote-item"]}>
                    <span>Transaction Value</span>
                    <span>{FormatCurrency(t.total.toFixed(2))} USD</span>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
          <Button type="text" onClick={() => setReceipt(t.id)}>
            <EyeOutlined />
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Card
        style={{ width: "100%", border: 0, overflow: "hidden" }}
        bodyStyle={{ padding: 0 }}
      >
        <div className={style["container"]} style={{ paddingBottom: "24px" }}>
          <div className={`${style["toggle-group"]} ${style["full-width"]}`}>
            <label
              onClick={() => setMode(OrderState.Open)}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                mode === OrderState.Open ? style["active"] : ""
              }`}
            >
              Open Orders
            </label>
            <label
              onClick={() => setMode(OrderState.Closed)}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                mode === OrderState.Closed ? style["active"] : ""
              }`}
            >
              Closed Orders
            </label>
          </div>
        </div>
        <div>
          <Table
            className={style["table"]}
            size="small"
            style={{ width: "100%", height: "400px", overflowY: "auto" }}
            pagination={{
              pageSize: 6,
            }}
            rowKey={(t) => t.id}
            dataSource={data}
            columns={columns}
            locale={{
              emptyText: (
                <Typography
                  style={{ paddingTop: "2rem", color: "var(--color-text-l3)" }}
                >
                  No records to display
                </Typography>
              ),
            }}
          />
        </div>
      </Card>
    </>
  );
}
