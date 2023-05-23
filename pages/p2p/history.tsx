import { Card, Result, Table, Typography } from "antd";
import { ColumnsType } from "antd/es/table";
import { BalanceContext } from "context/balance";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/router";
import React from "react";
import useSWR from "swr";
import { OrderState, OrderType, P2POrderRecord } from "types";
import { axiosInstance } from "util/axios";
import { PreciseCalculation } from "util/calculation";
import { FormatCurrency } from "util/functions";

import style from "./pairs.module.css";

dayjs.extend(relativeTime);

export function HistoryScreen() {
  const { data: balances } = React.useContext(BalanceContext);
  const [mode, setMode] = React.useState(OrderState.Open);
  const router = useRouter();

  const { data, error, mutate } = useSWR(
    `/p2p-order?state=${mode}`,
    (url: string) =>
      axiosInstance.user.get<P2POrderRecord[]>(url).then((res) => res.data),
    {
      refreshInterval: 15_000,
    }
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

  const columns: ColumnsType<P2POrderRecord> = [
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
            style={{
              color: t.orderType === OrderType.Buy ? "#4ddc44" : "#dc4446",
            }}
          >
            {t.quantity} {t.assetCode}
          </div>
        </Typography>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (_, t) => (
        <Typography style={{ fontSize: "12px" }}>
          {FormatCurrency(PreciseCalculation.round(t.price))} USD
        </Typography>
      ),
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
      render: (_, t) => (
        <Typography style={{ fontSize: "12px" }}>
          {dayjs(t.createdAt).fromNow()}
        </Typography>
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
            onRow={(record) => {
              return {
                onClick: () => {
                  router.push(`/p2p/${record.id}`);
                },
              };
            }}
            dataSource={data}
            columns={columns}
            locale={{
              emptyText: (
                <Typography
                  style={{
                    paddingTop: "2rem",
                    color: "var(--color-text-l3)",
                  }}
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
