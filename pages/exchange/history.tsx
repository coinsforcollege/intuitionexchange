import { Button, Card, Modal, Result, Skeleton, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { BalanceContext } from "context/balance";
import React from "react";
import useSWR from "swr";
import { ApiOrder } from "types";
import { axiosInstance } from "util/axios";
import { FormatCurrency, FormatPrice } from "util/functions";

import style from "./pairs.module.css";

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
            width={"400px"}
            open={receipt === t.id}
            onCancel={() => setReceipt("")}
            title={`${t.assetCode} ${t.type === "buy" ? "Purchased" : "Sold"}`}
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
