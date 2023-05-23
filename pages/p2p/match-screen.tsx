import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
import useSWR from "swr";
import { axiosInstance } from "util/axios";

import style from "./pairs.module.css";

interface Response {
  createdAt: string;
  price: number;
  quantity: number;
  value: number;
}

export function MatchScreen(props: {
  asset: string;
  base: string;
  price: number;
  setPrice: React.Dispatch<React.SetStateAction<number>>;
  setUnit: React.Dispatch<React.SetStateAction<number>>;
  unit: number;
}) {
  const { data } = useSWR(
    `/p2p-order/match-history?asset=${props.asset}&base=${props.base}`,
    (url: string) =>
      axiosInstance.user.get<Response[]>(url).then((res) => res.data)
  );

  return (
    <Card style={{ minHeight: "400px" }} bodyStyle={{ padding: 0 }}>
      <Typography
        style={{
          fontSize: "14px",
          fontWeight: 700,
          textTransform: "uppercase",
          padding: "1rem",
        }}
      >
        Match History
      </Typography>
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
              <h6>Value</h6>
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
                  (data[_index + 1]?.price ?? 0) <= d.price
                    ? style["fadeInGreen"]
                    : style["fadeInRed"]
                }
                onClick={() => {
                  props.setPrice(d.price);
                  props.setUnit(d.quantity);
                }}
              >
                <td>
                  {`${d.price} ${props.base}`}{" "}
                  {(data[_index + 1]?.price ?? 0) <= d.price ? (
                    <CaretUpOutlined />
                  ) : (
                    <CaretDownOutlined />
                  )}
                </td>
                <td>
                  {d.quantity} {props.asset}
                </td>
                <td>
                  {d.value} {props.base}
                </td>
                <td>{dayjs(d.createdAt).format("HH:mm:ss")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
}
