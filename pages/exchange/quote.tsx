import {
  Button,
  Card,
  ConfigProvider,
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

import { ExchangeContext } from "../../context/exchange-context";
import style from "./pairs.module.css";

export function QuoteScreen({ asset, base }: { asset: string; base: string }) {
  const [loading, setLoading] = React.useState(false);
  const { pairs } = React.useContext(ExchangeContext);
  const { api: notification } = React.useContext(NotificationContext);
  const { data: balances, refresh } = React.useContext(BalanceContext);
  const [orderType, setOrderType] = React.useState<OrderType>(OrderType.Buy);
  const [unit, setUnit] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [showQuote, setShowQuote] = React.useState(false);

  React.useEffect(() => {
    setUnit(0);
    setTotal(0);
  }, [asset, base]);

  const price = pairs[asset]?.[base]?.price ?? 0;
  const priceInUSD = pairs[asset]?.["USD"]?.price ?? 0;
  const quoteTotalValue = PreciseCalculation.multiplication(priceInUSD, unit);
  const quoteMakerFee = PreciseCalculation.multiplication(
    quoteTotalValue,
    0.005
  );
  const quotePlatformFee = PreciseCalculation.multiplication(
    quoteTotalValue,
    0.0049
  );

  const trade = async () => {
    setLoading(true);

    await axiosInstance.user
      .post("/trade", {
        base: base,
        asset: asset,
        unit: unit,
        orderType: orderType,
      })
      .then(() => {
        notification.success({
          message: "order executed",
          placement: "bottomLeft",
        });
        setUnit(0);
        setTotal(0);
      })
      .catch(HandleError(notification));

    refresh();

    setLoading(false);
  };

  return (
    <>
      <Modal
        width={"400px"}
        open={showQuote}
        title={`${
          orderType === OrderType.Buy ? "Buy" : "Sell"
        } ${asset} for ${base}`}
        onCancel={() => setShowQuote(false)}
        footer={[]}
      >
        <div style={{ paddingTop: "2rem" }}>
          <div className={style["quote-main"]}>
            <div className={style["quote-container"]}>
              <div className={style["quote-item"]}>
                <span>Spend</span>
                <span>
                  {FormatCurrency(unit)} {asset}
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>You Receive</span>
                <span>
                  {FormatCurrency(
                    PreciseCalculation.round(
                      PreciseCalculation.multiplication(price, unit)
                    )
                  )}{" "}
                  {base}
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Rate (per {asset})</span>
                <span>
                  {FormatCurrency(PreciseCalculation.round(price))} {base}
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Total Value</span>
                <span>
                  {FormatCurrency(PreciseCalculation.round(quoteTotalValue))}{" "}
                  USD
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Maker Fee (0.50%)</span>
                <span>
                  {FormatCurrency(PreciseCalculation.round(quoteMakerFee))} USD
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Platform Fee (0.49%)</span>
                <span>
                  {FormatCurrency(PreciseCalculation.round(quotePlatformFee))}{" "}
                  USD
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Slippage</span>
                <span>3%</span>
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
              danger={orderType === OrderType.Sell}
              onClick={() => {
                setShowQuote(false);
                trade();
              }}
            >
              Confirm {orderType}
            </Button>
          </ConfigProvider>
        </div>
      </Modal>
      <Card
        style={{ height: "400px", overflow: "hidden", border: 0 }}
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
              onClick={() => setOrderType(OrderType.Buy)}
              style={{
                backgroundColor:
                  orderType === OrderType.Buy
                    ? "var(--color-background-l0)"
                    : "var(--color-background-l1)",
                boxShadow:
                  orderType === OrderType.Buy
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
                    orderType === OrderType.Buy
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
              onClick={() => setOrderType(OrderType.Sell)}
              style={{
                borderLeft: "1px solid var(--color-divider)",
                backgroundColor:
                  orderType === OrderType.Sell
                    ? "var(--color-background-l0)"
                    : "var(--color-background-l1)",
                boxShadow:
                  orderType === OrderType.Sell
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
                    orderType === OrderType.Sell
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
                      <span>AMOUNT</span> <br /> <span>{asset}</span>
                    </div>
                  }
                  className={style["antd-input"]}
                  value={unit > 0 ? unit : null}
                  placeholder="0.0"
                  onChange={(val: number | null) => {
                    const value = val ?? 0;
                    setUnit(value);
                    setTotal(
                      Number(
                        PreciseCalculation.round(
                          PreciseCalculation.multiplication(value, price)
                        )
                      )
                    );
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
                        balances.find((bx) => bx.code === asset)?.unit ?? 0
                      )
                    )}{" "}
                    {asset}
                  </span>
                </Typography>
              </div>
              <div>
                <InputNumber
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
                      <span>TOTAL</span> <br /> <span>{base}</span>
                    </div>
                  }
                  className={style["antd-input"]}
                  value={total > 0 ? total : null}
                  placeholder="0"
                  onChange={(val: number | null) => {
                    const value = val ?? 0;
                    setTotal(value);
                    setUnit(
                      Number(
                        PreciseCalculation.round(
                          PreciseCalculation.division(value, price)
                        )
                      )
                    );
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
                        balances.find((bx) => bx.code === base)?.unit ?? 0
                      )
                    )}{" "}
                    {base}
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
                  htmlType="submit"
                  loading={loading}
                  style={{
                    width: "100%",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                  type="primary"
                  danger={orderType === OrderType.Sell}
                >
                  {orderType} {asset.toUpperCase()}
                </Button>
              </ConfigProvider>
              <Typography
                style={{ fontSize: "0.825rem", color: "var(--color-text-l3)" }}
              >
                0.5% Platform Fees | 0.5% Market Maker Fee
              </Typography>
            </Space>
          </form>
        </div>
      </Card>
    </>
  );
}
