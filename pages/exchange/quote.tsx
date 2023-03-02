import {
  Button,
  Card,
  ConfigProvider,
  InputNumber,
  Modal,
  Space,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { BalanceContext } from "context/balance";
import { NotificationContext } from "context/notification";
import React from "react";
import { axiosInstance } from "util/axios";
import { FormatCurrency, FormatPrice } from "util/functions";

import { ExchangeContext } from "./exchange-context";
import style from "./pairs.module.css";

export function QuoteScreen({ asset, base }: { asset: string; base: string }) {
  const { pairs } = React.useContext(ExchangeContext);
  const { api: notification } = React.useContext(NotificationContext);
  const { data: balances, refresh } = React.useContext(BalanceContext);
  const [mode, setMode] = React.useState<"buy" | "sell">("buy");
  const [unit, setUnit] = React.useState(0);
  const [total, setTotal] = React.useState(0);
  const [showQuote, setShowQuote] = React.useState(false);

  React.useEffect(() => {
    setUnit(0);
    setTotal(0);
  }, [asset, base]);

  const price = pairs[asset]?.[base]?.PRICE ?? 0;
  const priceInUSD = pairs[asset]?.["USD"]?.PRICE ?? 0;
  const quoteTotalValue = priceInUSD * unit;
  const quoteMakerFee = quoteTotalValue * 0.005;
  const quotePlatformFee = quoteTotalValue * 0.0049;

  const trade = () => {
    axiosInstance.user
      .post("/trade", {
        base: base,
        asset: asset,
        unit: unit,
        isBuyOrder: mode === "buy",
      })
      .then(() => {
        notification.success("order executed");
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
      <Modal
        width={"400px"}
        open={showQuote}
        title={`${mode === "buy" ? "Buy" : "Sell"} ${asset} for ${base}`}
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
                  {FormatCurrency(FormatPrice(price * unit))} {base}
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Rate (per {asset})</span>
                <span>
                  {FormatCurrency(FormatPrice(price))} {base}
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Total Value</span>
                <span>
                  {FormatCurrency(FormatPrice(quoteTotalValue, 2))} USD
                </span>
              </div>
              <div className={style["quote-item"]}>
                <span>Maker Fee (0.50%)</span>
                <span>{FormatCurrency(FormatPrice(quoteMakerFee, 2))} USD</span>
              </div>
              <div className={style["quote-item"]}>
                <span>Platform Fee (0.49%)</span>
                <span>
                  {FormatCurrency(FormatPrice(quotePlatformFee, 2))} USD
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
              danger={mode === "sell"}
              onClick={() => {
                setShowQuote(false);
                trade();
              }}
            >
              Confirm {mode.toUpperCase()}
            </Button>
          </ConfigProvider>
        </div>
      </Modal>
      <Card
        style={{ height: "100%", overflow: "hidden", border: 0 }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ display: "flex" }}>
          <div
            onClick={() => setMode("buy")}
            style={{
              backgroundColor:
                mode == "buy"
                  ? "var(--color-background-l0)"
                  : "var(--color-background-l1)",
              boxShadow:
                mode == "buy"
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
                  mode == "buy"
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
            onClick={() => setMode("sell")}
            style={{
              borderLeft: "1px solid var(--color-divider)",
              backgroundColor:
                mode == "sell"
                  ? "var(--color-background-l0)"
                  : "var(--color-background-l1)",
              boxShadow:
                mode == "sell"
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
                  mode == "sell"
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
                    <span>AMOUNT</span> <br />{" "}
                    <span style={{ fontWeight: "bold" }}>{asset}</span>
                  </div>
                }
                className={style["antd-input"]}
                value={unit > 0 ? unit : null}
                placeholder="0.0"
                onChange={(val: number | null) => {
                  const value = val ?? 0;
                  setUnit(value);
                  setTotal(FormatPrice(value * price));
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
                      width: "48px",
                      paddingRight: "8px",
                    }}
                  >
                    <span>TOTAL</span> <br />{" "}
                    <span style={{ fontWeight: "bold" }}>{base}</span>
                  </div>
                }
                className={style["antd-input"]}
                value={total > 0 ? total : null}
                placeholder="0"
                onChange={(val: number | null) => {
                  const value = val ?? 0;
                  setTotal(value);
                  setUnit(FormatPrice(value / price));
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
                style={{
                  width: "100%",
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
                type="primary"
                danger={mode === "sell"}
                onClick={() => setShowQuote(true)}
              >
                {mode.toUpperCase()} {asset.toUpperCase()}
              </Button>
            </ConfigProvider>
          </Space>
        </div>
      </Card>
    </>
  );
}
