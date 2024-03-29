import {
  Button,
  Card,
  Descriptions,
  Result,
  Skeleton,
  Space,
  Typography,
} from "antd";
import Link from "next/link";
import React from "react";
import useSWR from "swr";
import { ApiFiatTotals } from "types";
import { axiosInstance } from "util/axios";
import { FormatCurrency } from "util/functions";

export function FiatBalance() {
  const { data, error, isLoading, mutate } = useSWR("/api/fiat/totals", (url) =>
    axiosInstance.user.get<ApiFiatTotals>(url).then((res) => res.data)
  );

  React.useEffect(() => {
    mutate();
  }, []);

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

  return (
    <>
      <Descriptions
        style={{ width: "100%" }}
        title={
          <Typography
            style={{
              fontWeight: 700,
              fontSize: "14px",
              lineHeight: 1.5,
              color: "var(--color-text-l2)",
              textTransform: "uppercase",
            }}
          >
            Balances
          </Typography>
        }
        labelStyle={{
          fontWeight: 700,
          fontSize: "12px",
          lineHeight: 1.5,
          marginBottom: "20px",
          color: "var(--color-text-l2)",
          textTransform: "uppercase",
        }}
        extra={
          <Space>
            <Link style={{ color: "inherit" }} href="/wallet/transactions">
              <Button>Transactions</Button>
            </Link>
            <Link href="/wallet/transfers">
              <Button type="primary">Funds</Button>
            </Link>
          </Space>
        }
        bordered
        column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
      >
        <Descriptions.Item label="Settled">
          ${FormatCurrency(data.settled)}
        </Descriptions.Item>
        <Descriptions.Item label="Contingent Hold">
          ${FormatCurrency(data.contingentHold)}
        </Descriptions.Item>
        <Descriptions.Item label="Pending Transfer">
          ${FormatCurrency(data.pendingTransfer)}
        </Descriptions.Item>
        <Descriptions.Item label="Disbursable">
          ${FormatCurrency(data.disbursable)}
        </Descriptions.Item>
        <Descriptions.Item label="Non Contingent Hold">
          ${FormatCurrency(data.nonContingentHold)}
        </Descriptions.Item>
        <Descriptions.Item label="Pending Settlement">
          ${FormatCurrency(data.pendingSettlement)}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
}
