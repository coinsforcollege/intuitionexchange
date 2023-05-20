import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
import useSWR from "swr";
import { axiosInstance } from "util/axios";

import style from "./pairs.module.css";

interface Response {
  createdAt: string;
  price: number;
  value: number;
  volume: number;
}

export function TradeHistory(props: { asset: string }) {
  const { data } = useSWR(
    `/trade/history?asset=${props.asset}&base=${"USD"}`,
    (url: string) =>
      axiosInstance.user.get<Response[]>(url).then((res) => res.data)
  );

  return (
    <Card style={{ minHeight: "440px" }} bodyStyle={{ padding: 0 }}>
      <Typography
        style={{
          textAlign: "center",
          fontSize: "14px",
          fontWeight: 700,
          textTransform: "uppercase",
          padding: "1rem",
        }}
      >
        Trade History
      </Typography>
      <table className={style["trade-history"]}>
        <thead>
          <tr>
            <th>
              <h6>Price (USD)</h6>
            </th>
            <th>
              <h6>Volume ({props.asset})</h6>
            </th>
            <th>
              <h6>Value (USD)</h6>
            </th>
            <th>
              <h6>Time</h6>
            </th>
          </tr>
        </thead>
        <tbody>
          {!data?.length && (
            <tr>
              <td colSpan={4}>
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
                className={
                  (data[_index + 1]?.price ?? 0) < d.price
                    ? style["fadeInGreen"]
                    : style["fadeInRed"]
                }
              >
                <td>
                  {d.price}{" "}
                  {(data[_index + 1]?.price ?? 0) < d.price ? (
                    <CaretUpOutlined />
                  ) : (
                    <CaretDownOutlined />
                  )}
                </td>
                <td>{d.volume}</td>
                <td>{d.value}</td>
                <td>{dayjs(d.createdAt).format("HH:mm:ss")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
}
