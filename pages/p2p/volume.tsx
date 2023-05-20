import { Card, Typography } from "antd";
import React from "react";
import useSWR from "swr";
import { OrderType } from "types";
import { axiosInstance } from "util/axios";

import style from "./pairs.module.css";

interface Response {
  orders: number;
  price: number;
  volume: number;
}

export function VolumeScreen(props: {
  asset: string;
  base: string;
  price: number;
  setMode: React.Dispatch<React.SetStateAction<OrderType>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setUnit: React.Dispatch<React.SetStateAction<number>>;
  unit: number;
}) {
  const [mode, setMode] = React.useState<OrderType>(OrderType.Buy);

  const { data } = useSWR(
    `/p2p-order/total-volume?asset=${props.asset}&base=${props.base}&orderType=${mode}`,
    (url: string) =>
      axiosInstance.user.get<Response[]>(url).then((res) => res.data)
  );

  return (
    <Card
      style={{ minHeight: "400px", overflow: "hidden" }}
      bodyStyle={{ padding: 0 }}
    >
      <div className={style["container"]} style={{ paddingBottom: "24px" }}>
        <div className={`${style["toggle-group"]} ${style["full-width"]}`}>
          <label
            onClick={() => setMode(OrderType.Buy)}
            className={`${style["btn"]} ${style["btn-primary"]} ${
              mode === OrderType.Buy ? style["active"] : ""
            }`}
          >
            Buyers
          </label>
          <label
            onClick={() => setMode(OrderType.Sell)}
            className={`${style["btn"]} ${style["btn-primary"]} ${
              mode === OrderType.Sell
                ? `${style["active"]} ${style["seller"]}`
                : ""
            }`}
          >
            Sellers
          </label>
        </div>
      </div>
      <table className={style["trade-history"]}>
        <thead>
          <tr>
            <th>
              <h6>Price</h6>
            </th>
            <th>
              <h6>Volume</h6>
            </th>
            <th>
              <h6>Orders</h6>
            </th>
          </tr>
        </thead>
        <tbody>
          {!data?.length && (
            <tr>
              <td colSpan={3}>
                <Typography
                  style={{ paddingTop: "2rem", color: "var(--color-text-l3)" }}
                >
                  No records to display
                </Typography>
              </td>
            </tr>
          )}
          {data &&
            data.map((d, _index) => (
              <tr
                key={`match-${_index}`}
                onClick={() => {
                  props.setPrice(d.price);
                  props.setUnit(d.volume);
                  props.setMode(
                    mode === OrderType.Buy ? OrderType.Sell : OrderType.Buy
                  );
                }}
              >
                <td>{d.price}</td>
                <td>{d.volume}</td>
                <td>{d.orders}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
}
