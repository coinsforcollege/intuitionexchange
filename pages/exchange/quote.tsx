import {
  Button,
  Card,
  Descriptions,
  InputNumber,
  Modal,
  Radio,
  Space,
  Typography,
} from "antd";
import { AxiosError } from "axios";
import { FiatContext } from "context/fiat";
import { NotificationContext } from "context/notification";
import React from "react";
import { axiosInstance } from "util/axios";
import { FormatCurrency } from "util/functions";

export function QuoteScreen({ assetId }: { assetId: string | undefined }) {
  const { api: notification } = React.useContext(NotificationContext);
  const { data: balance } = React.useContext(FiatContext);
  const [mode, setMode] = React.useState<"buy" | "sell">("buy");
  const [unit, setUnit] = React.useState(0);

  const onSubmit = () => {
    if (!assetId) return;

    axiosInstance.user
      .post("/api/liquidity/quote", {
        assetId: assetId,
        unit: unit,
        type: mode,
      })
      .then((res) => {
        Modal.confirm({
          okText: "Confirm",
          title: mode === "buy" ? "Buy order quote" : "Sell order quote",
          content: (
            <>
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Asset Name">
                  {res.data.assetName}
                </Descriptions.Item>
                <Descriptions.Item label="Action">
                  {res.data.transactionType}
                </Descriptions.Item>
                <Descriptions.Item label="Price Per Unit">
                  ${FormatCurrency(res.data.pricePerUnit)}
                </Descriptions.Item>
                <Descriptions.Item label="Total Unit">
                  {res.data.unitCount} {res.data.assetName}
                </Descriptions.Item>
                <Descriptions.Item label="Asset Price">
                  ${FormatCurrency(res.data.baseAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Transaction Fee">
                  ${FormatCurrency(res.data.feeAmount)}
                </Descriptions.Item>
                <Descriptions.Item label="Total Amount">
                  ${FormatCurrency(res.data.totalAmount)}
                </Descriptions.Item>
              </Descriptions>
            </>
          ),
          onOk() {
            axiosInstance.user
              .post("/api/liquidity/quote/execute", {
                assetId: assetId,
                unit: unit,
                type: mode,
              })
              .then(() => {
                notification.success("order executed");
              })
              .catch(
                (err: AxiosError<{ errors?: string[]; message?: string }>) => {
                  if (err.response?.data.errors) {
                    err.response.data.errors.forEach((err) =>
                      notification.error(err)
                    );
                  }
                  notification.error({
                    content:
                      err.response?.data?.message ??
                      err.message ??
                      "Unknown error, please try again",
                  });
                }
              );
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      });
  };

  React.useEffect(() => {
    setUnit(0);
  }, [assetId]);

  return (
    <Card>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Space style={{ width: "100%", justifyContent: "space-between" }}>
          <Typography>
            Balance: ${FormatCurrency(balance?.settled ?? 0)}
          </Typography>
          <Radio.Group
            style={{ width: "100%", minWidth: "max-content" }}
            size="large"
            options={[
              { label: "Buy", value: "buy" },
              { label: "Sell", value: "sell" },
            ]}
            onChange={(val) => setMode(val.target.value)}
            value={mode}
            optionType="button"
            buttonStyle="solid"
          />
        </Space>
        <InputNumber
          value={unit > 0 ? unit : null}
          disabled={!assetId}
          style={{ width: "100%" }}
          placeholder="Enter unit"
          onChange={(val: number | null) => setUnit(val ?? 0)}
        />
        <Button
          disabled={unit === 0}
          style={{ width: "100%", textTransform: "uppercase" }}
          type="primary"
          onClick={onSubmit}
        >
          View Quote
        </Button>
      </Space>
    </Card>
  );
}
