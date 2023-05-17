import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Card, Typography } from "antd";
import dayjs from "dayjs";
import useSWR from "swr";
import { axiosInstance } from "util/axios";

import style from "./pairs.module.css";

interface Response {
  price: number;
  quantity: number;
  timestamp: string;
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
              <h6>Price ({props.base})</h6>
            </th>
            <th>
              <h6>Volume ({props.asset})</h6>
            </th>
            <th>
              <h6>Value ({props.base})</h6>
            </th>
            <th>
              <h6>Time</h6>
            </th>
          </tr>
        </thead>
        <tbody>
          {!data?.length && (
            <tr>
              <td colSpan={3}>
                <Typography style={{ paddingTop: "2rem", opacity: 0.8 }}>
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
                onClick={() => {
                  props.setPrice(d.price);
                  props.setUnit(d.quantity);
                }}
              >
                <td>
                  {d.price}{" "}
                  {(data[_index + 1]?.price ?? 0) < d.price ? (
                    <CaretUpOutlined />
                  ) : (
                    <CaretDownOutlined />
                  )}
                </td>
                <td>{d.quantity}</td>
                <td>{d.value}</td>
                <td>{dayjs(d.timestamp).format("HH:mm:ss")}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Card>
  );
}
