import {
  Button,
  Card,
  ConfigProvider,
  Input,
  InputNumber,
  Space,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { BalanceContext } from "context/balance";
import { NotificationContext } from "context/notification";
import React from "react";
import { OrderType } from "types";
import { axiosInstance } from "util/axios";
import { PreciseCalculation } from "util/calculation";
import { FormatCurrency, FormatPrice } from "util/functions";

import style from "./pairs.module.css";

export function QuoteScreen(props: {
  asset: string;
  base: string;
  mode: OrderType;
  price: number;
  setMode: React.Dispatch<React.SetStateAction<OrderType>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setUnit: React.Dispatch<React.SetStateAction<number>>;
  unit: number;
}) {
  const { api: notification } = React.useContext(NotificationContext);
  const { data: balances, refresh } = React.useContext(BalanceContext);

  const total = PreciseCalculation.multiplication(props.unit, props.price);

  React.useEffect(() => {
    props.setUnit(0);
    props.setPrice(0);
  }, [props.asset, props.base]);

  const handle = () => {
    axiosInstance.user
      .post("/p2p-order", {
        base: props.base,
        asset: props.asset,
        price: props.price,
        unit: props.unit,
        orderType: props.mode,
      })
      .then(() => {
        notification.success("Order placed");
        refresh();
      })
      .catch((err: AxiosError<{ errors?: string[] }>) => {
        if (err.response?.data.errors?.length) {
          err.response.data.errors.forEach((err) => notification.error(err, 8));
        } else {
          notification.error({
            content: err.message ?? "An error occurred, please try again later",
            duration: 8,
          });
        }
        refresh();
      });
  };

  return (
    <>
      <Card
        style={{ height: "100%", overflow: "hidden", border: 0 }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: "flex" }}>
          <div
            onClick={() => props.setMode(OrderType.Buy)}
            style={{
              backgroundColor:
                props.mode == OrderType.Buy
                  ? "var(--color-background-l0)"
                  : "var(--color-background-l1)",
              boxShadow:
                props.mode == OrderType.Buy
                  ? "inset 0 4px 0 0 var(--color-green)"
                  : "inset 0 -1px 0 0 var(--color-divider)",
              padding: "10px 12px",
              flexGrow: 1,
              cursor: "pointer",
            }}
          >
            <Typography
              style={{
                display: "block",
                color:
                  props.mode == OrderType.Buy
                    ? "var(--color-text-l1)"
                    : "var(--color-text-l2)",
                fontSize: "12px",
                letterSpacing: "0.4px",
                textTransform: "uppercase",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: 1.33,
              }}
            >
              Buy
            </Typography>
          </div>
          <div
            onClick={() => props.setMode(OrderType.Sell)}
            style={{
              borderLeft: "1px solid var(--color-divider)",
              backgroundColor:
                props.mode == OrderType.Sell
                  ? "var(--color-background-l0)"
                  : "var(--color-background-l1)",
              boxShadow:
                props.mode == OrderType.Sell
                  ? "inset 0 4px 0 0 var(--color-red)"
                  : "inset 0 -1px 0 0 var(--color-divider)",
              padding: "10px 12px",
              flexGrow: 1,
              cursor: "pointer",
            }}
          >
            <Typography
              style={{
                display: "block",
                color:
                  props.mode == OrderType.Sell
                    ? "var(--color-text-l1)"
                    : "var(--color-text-l2)",
                fontSize: "12px",
                letterSpacing: "0.4px",
                textTransform: "uppercase",
                textAlign: "center",
                fontWeight: "bold",
                lineHeight: 1.33,
              }}
            >
              Sell
            </Typography>
          </div>
        </div>
        <div style={{ padding: "24px" }}>
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div>
              <InputNumber
                prefix={
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--color-text-l2)",
                      textAlign: "end",
                      width: "48px",
                      paddingRight: "8px",
                    }}
                  >
                    <span>PRICE</span> <br />{" "}
                    <span style={{ fontWeight: "bold" }}>{props.base}</span>
                  </div>
                }
                className={style["antd-input"]}
                value={props.price > 0 ? props.price : null}
                placeholder="0.0"
                onChange={(val: number | null) => {
                  const value = val ?? 0;
                  props.setPrice(value);
                }}
              />
            </div>
            <div>
              <InputNumber
                prefix={
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--color-text-l2)",
                      textAlign: "end",
                      width: "48px",
                      paddingRight: "8px",
                    }}
                  >
                    <span>VOLUME</span> <br />{" "}
                    <span style={{ fontWeight: "bold" }}>{props.asset}</span>
                  </div>
                }
                className={style["antd-input"]}
                value={props.unit > 0 ? props.unit : null}
                placeholder="0.0"
                onChange={(val: number | null) => {
                  const value = val ?? 0;
                  props.setUnit(value);
                }}
              />
              <Typography
                style={{
                  fontSize: "10px",
                  color: "var(--color-text-l3)",
                  display: "flex",
                  marginTop: "8px",
                }}
              >
                <span style={{ flexGrow: 1 }}>
                  Balance:{" "}
                  {FormatCurrency(
                    FormatPrice(
                      balances.find((bx) => bx.code === props.asset)?.unit ?? 0
                    )
                  )}{" "}
                  {props.asset}
                </span>
              </Typography>
            </div>
            <div>
              <Input
                disabled
                prefix={
                  <div
                    style={{
                      fontSize: "10px",
                      color: "var(--color-text-l2)",
                      textAlign: "end",
                      width: "48px",
                      paddingRight: "8px",
                    }}
                  >
                    <span>TOTAL</span> <br />{" "}
                    <span style={{ fontWeight: "bold" }}>{props.base}</span>
                  </div>
                }
                className={style["antd-input"]}
                value={FormatCurrency(total)}
                style={{ padding: 0, paddingInlineStart: "11px" }}
                placeholder="0"
              />
              <Typography
                style={{
                  fontSize: "10px",
                  color: "var(--color-text-l3)",
                  display: "flex",
                  marginTop: "8px",
                }}
              >
                <span style={{ flexGrow: 1 }}>
                  Balance:{" "}
                  {FormatCurrency(
                    FormatPrice(
                      balances.find((bx) => bx.code === props.base)?.unit ?? 0
                    )
                  )}{" "}
                  {props.base}
                </span>
              </Typography>
            </div>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#55bd6c",
                  colorPrimaryBg: "#55bd6c00",
                  colorErrorBg: "#f6685e00",
                  colorError: "#f6685e",
                },
              }}
            >
              <Button
                style={{
                  width: "100%",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
                type="primary"
                danger={props.mode === OrderType.Sell}
                onClick={() => handle()}
              >
                {props.mode.toUpperCase()} {props.asset.toUpperCase()}
              </Button>
            </ConfigProvider>
          </Space>
        </div>
      </Card>
    </>
  );
}
