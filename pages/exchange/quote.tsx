import {
  Button,
  Card,
  ConfigProvider,
  Descriptions,
  InputNumber,
  Modal,
  Radio,
  Space,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { BalanceContext } from "context/balance";
import { NotificationContext } from "context/notification";
import React from "react";
import { axiosInstance } from "util/axios";
import { FormatPrice } from "util/functions";

import { ExchangeContext } from "./exchange-context";

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
          err.response.data.errors.forEach((err) => notification.error(err));
        } else {
          notification.error({
            content: err.message ?? "Unknown error, please try again",
          });
        }
        refresh();
      });
  };

  return (
    <>
      <Modal
        open={showQuote}
        title={`${mode === "buy" ? "Buy" : "Sell"} ${asset} for ${base}`}
        okText="Place Order"
        onOk={() => {
          setShowQuote(false);
          trade();
        }}
        onCancel={() => setShowQuote(false)}
      >
        <div style={{ paddingTop: "2rem" }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Spend">
              {unit} {asset}
            </Descriptions.Item>
            <Descriptions.Item label="You Receive">
              {FormatPrice(price * unit)} {base}
            </Descriptions.Item>
            <Descriptions.Item label="Rate">
              {FormatPrice(price)} {base} per {asset}
            </Descriptions.Item>
            <Descriptions.Item label="Total Value">
              {FormatPrice(quoteTotalValue, 2)} USD
            </Descriptions.Item>
            <Descriptions.Item label="Maker Fee (0.50%)">
              {FormatPrice(quoteMakerFee, 2)}
            </Descriptions.Item>
            <Descriptions.Item label="Platform Fee (0.49%)">
              {FormatPrice(quotePlatformFee, 2)}
            </Descriptions.Item>
            <Descriptions.Item label="Slippage:">3%</Descriptions.Item>
          </Descriptions>
        </div>
      </Modal>
      <Card>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Typography>
              At Price {asset}: {FormatPrice(price)} {base}
            </Typography>

            <Radio.Group
              style={{
                width: "100%",
                minWidth: "max-content",
              }}
              size="large"
              onChange={(val) => setMode(val.target.value)}
              value={mode}
              optionType="button"
              buttonStyle="solid"
            >
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#4ddc44",
                  },
                }}
              >
                <Radio.Button value="buy">Buy</Radio.Button>
              </ConfigProvider>
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: "#dc4446",
                  },
                }}
              >
                <Radio.Button value="sell">Sell</Radio.Button>
              </ConfigProvider>
            </Radio.Group>
          </Space>
          <Typography>Amount {asset}</Typography>
          <InputNumber
            value={unit > 0 ? unit : null}
            style={{ width: "100%" }}
            placeholder="0.0"
            onChange={(val: number | null) => {
              const value = val ?? 0;
              setUnit(value);
              setTotal(FormatPrice(value * price));
            }}
          />
          <Typography>Total {base}</Typography>
          <InputNumber
            value={total > 0 ? total : null}
            style={{ width: "100%" }}
            placeholder="0"
            onChange={(val: number | null) => {
              const value = val ?? 0;
              setTotal(value);
              setUnit(FormatPrice(value / price));
            }}
          />
          <Typography>
            Balance:{" "}
            {FormatPrice(balances.find((bx) => bx.code === base)?.unit ?? 0)}{" "}
            {base}{" "}
            {FormatPrice(balances.find((bx) => bx.code === asset)?.unit ?? 0)}{" "}
            {asset}
          </Typography>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#4ddc44",
              },
            }}
          >
            <Button
              disabled={unit === 0}
              style={{
                width: "100%",
                textTransform: "uppercase",
              }}
              type="primary"
              danger={mode === "sell"}
              onClick={() => setShowQuote(true)}
            >
              {mode.toUpperCase()} {asset.toUpperCase()}
            </Button>
          </ConfigProvider>
        </Space>
      </Card>
    </>
  );
}
