import {
  Button,
  Card,
  ConfigProvider,
  Input,
  InputNumber,
  Modal,
  Space,
  Typography,
} from "antd";
import { BalanceContext } from "context/balance";
import { NotificationContext } from "context/notification";
import React from "react";
import { OrderType } from "types";
import { axiosInstance } from "util/axios";
import { HandleError } from "util/axios/error-handler";
import { PreciseCalculation } from "util/calculation";
import { FormatCurrency } from "util/functions";

import style from "./pairs.module.css";

export function QuoteScreen(props: {
  asset: string;
  base: string;
  orderType: OrderType;
  price: number;
  setOrderType: React.Dispatch<React.SetStateAction<OrderType>>;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setUnit: React.Dispatch<React.SetStateAction<number>>;
  unit: number;
}) {
  const [showQuote, setShowQuote] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { api: notification } = React.useContext(NotificationContext);
  const { data: balances, refresh } = React.useContext(BalanceContext);

  const total = PreciseCalculation.multiplication(props.unit, props.price);

  React.useEffect(() => {
    props.setUnit(0);
    props.setPrice(0);
  }, [props.asset, props.base]);

  const handle = async () => {
    setLoading(true);

    await axiosInstance.user
      .post("/p2p-order", {
        base: props.base,
        asset: props.asset,
        price: props.price,
        unit: props.unit,
        orderType: props.orderType,
      })
      .then(() => {
        notification.success({
          message: "Order placed",
          placement: "bottomLeft",
        });
        props.setUnit(0);
        props.setPrice(0);
        refresh();
      })
      .catch(HandleError(notification));

    setLoading(false);
  };

  return (
    <>
      <Modal
        width={"400px"}
        open={showQuote}
        title={`${props.orderType === OrderType.Buy ? "Buy" : "Sell"} ${
          props.asset
        } for ${props.base}`}
        onCancel={() => setShowQuote(false)}
        footer={[]}
      >
        <div style={{ paddingTop: "2rem" }}>
          <div className={style["quote-main"]}>
            <div className={style["quote-container"]}>
              <div className={style["quote-item"]}>
                <span>Quantity</span>
                <span>
                  {FormatCurrency(props.unit)} {props.asset}
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>At Price</span>
                <span>
                  {FormatCurrency(props.price)} {props.base}
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Order Value</span>
                <span>
                  {FormatCurrency(
                    PreciseCalculation.round(
                      PreciseCalculation.multiplication(props.price, props.unit)
                    )
                  )}{" "}
                  {props.base}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: "1rem" }}>
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
              danger={props.orderType === OrderType.Sell}
              onClick={() => {
                setShowQuote(false);
                handle();
              }}
            >
              Confirm {props.orderType}
            </Button>
          </ConfigProvider>
        </div>
      </Modal>
      <Card
        style={{ height: "440px", overflow: "hidden", border: 0 }}
        bodyStyle={{
          padding: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>
          <div style={{ display: "flex" }}>
            <div
              onClick={() => props.setOrderType(OrderType.Buy)}
              style={{
                backgroundColor:
                  props.orderType == OrderType.Buy
                    ? "var(--color-background-l0)"
                    : "var(--color-background-l1)",
                boxShadow:
                  props.orderType == OrderType.Buy
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
                    props.orderType == OrderType.Buy
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
              onClick={() => props.setOrderType(OrderType.Sell)}
              style={{
                borderLeft: "1px solid var(--color-divider)",
                backgroundColor:
                  props.orderType == OrderType.Sell
                    ? "var(--color-background-l0)"
                    : "var(--color-background-l1)",
                boxShadow:
                  props.orderType == OrderType.Sell
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
                    props.orderType == OrderType.Sell
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
        </div>
        <div style={{ padding: "24px", flexGrow: 1 }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setShowQuote(true);
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Space
              direction="vertical"
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
              }}
              size="large"
            >
              <div>
                <InputNumber
                  required
                  prefix={
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--color-text-l2)",
                        textAlign: "end",
                        width: "64px",
                        paddingRight: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      <span>QUANTITY</span> <br /> <span>{props.asset}</span>
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
                      PreciseCalculation.round(
                        balances.find((bx) => bx.code === props.asset)?.unit ??
                          0
                      )
                    )}{" "}
                    {props.asset}
                  </span>
                </Typography>
              </div>
              <div>
                <InputNumber
                  required
                  prefix={
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--color-text-l2)",
                        textAlign: "end",
                        width: "64px",
                        paddingRight: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      <span>AT PRICE</span> <br /> <span>{props.base}</span>
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
                <Input
                  disabled
                  prefix={
                    <div
                      style={{
                        fontSize: "10px",
                        color: "var(--color-text-l2)",
                        textAlign: "end",
                        width: "64px",
                        paddingRight: "8px",
                        fontWeight: "bold",
                      }}
                    >
                      <span>TOTAL</span> <br /> <span>{props.base}</span>
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
                      PreciseCalculation.round(
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
                  disabled
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: "100%",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                  type="primary"
                  danger={props.orderType === OrderType.Sell}
                >
                  {props.orderType.toUpperCase()} {props.asset.toUpperCase()}
                </Button>
              </ConfigProvider>
            </Space>
          </form>
        </div>
      </Card>
    </>
  );
}
