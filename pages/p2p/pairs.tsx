import { SearchOutlined } from "@ant-design/icons";
import { Card, Input } from "antd";
import { ExchangeContext } from "context/exchange-context";
import React from "react";
import { FormatCurrency, FormatPrice } from "util/functions";

import style from "./pairs.module.css";

export function PairsScreen({
  asset,
  base,
  setBase,
  setAsset,
}: {
  asset: string;
  base: string;
  setAsset: React.Dispatch<React.SetStateAction<string>>;
  setBase: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [search, setSearch] = React.useState("");
  const [mode, setMode] = React.useState(base);
  const { pairs } = React.useContext(ExchangeContext);

  const average = (pair: string) => {
    const price = pairs[pair]?.[mode]?.PRICE ?? 0;
    const openDay = pairs[pair]?.[mode]?.OPENDAY ?? 0;

    const difference = (price - openDay) / openDay;
    return difference;
  };

  return (
    <>
      <Card
        style={{ height: "100%", overflow: "hidden", border: 0 }}
        bodyStyle={{ padding: 0 }}
      >
        <div className={style["container"]}>
          <div className={`${style["toggle-group"]} ${style["full-width"]}`}>
            <label
              onClick={() => setMode("USD")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                mode === "USD" ? style["active"] : ""
              }`}
            >
              USD
            </label>
            <label
              onClick={() => setMode("BTC")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                mode === "BTC" ? style["active"] : ""
              }`}
            >
              BTC
            </label>
            <label
              onClick={() => setMode("ETH")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                mode === "ETH" ? style["active"] : ""
              }`}
            >
              ETH
            </label>
            <label
              onClick={() => setMode("USDT")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                mode === "USDT" ? style["active"] : ""
              }`}
            >
              USDT
            </label>
          </div>
        </div>
        <div style={{ padding: "12px 24px" }}>
          <Input
            onChange={(e) => {
              setSearch(e.target.value ?? "");
            }}
            prefix={<SearchOutlined />}
            size="small"
            placeholder="Search"
            className={style["search-input"]}
          />
        </div>
        <div>
          <div
            className="scroll"
            style={{ height: "750px", overflowY: "auto", paddingTop: "12px" }}
          >
            <a
              key={`TUIT${base}`}
              className={`${style["ticker-item"]} ${
                asset === "TUIT" && base === mode ? style["selected"] : ""
              }`}
              id={`ticker-TUIT`}
              href="/p2p"
              onClick={(e) => {
                e.preventDefault();
                setAsset("TUIT");
                setBase(mode);
              }}
            >
              <div className={style["currency-logo"]}>
                <img
                  onError={(e) => (e.currentTarget.src = "/asset/no-image.png")}
                  src={`/asset/${"TUIT".toLowerCase()}.png`}
                  alt={"TUIT"}
                  className={style["img"]}
                />
              </div>
              <div className={style["market"]}>
                <div className={style["market-name"]}>
                  <span className={style["market-name-text"]}>
                    TUIT
                    <span className={style["subtext"]}>/{mode}</span>
                  </span>
                </div>
                <div className={style["market-change"]}>
                  <span
                    style={{
                      color: "var(--color-green)",
                    }}
                    className={style["change"]}
                  >
                    {"▲"} 0%
                  </span>
                </div>
              </div>
              <div className={style["price"]}>
                <div className={style["price-box"]}>
                  <span
                    className={`${style["price-text"]} ${style["ticker-price"]}`}
                  >
                    -
                  </span>
                </div>
              </div>
            </a>
            {Object.keys(pairs)
              .filter(
                (pair) =>
                  pair !== mode &&
                  pair !== "USD" &&
                  pair.toLowerCase().startsWith(search)
              )
              .map((pair) => (
                <a
                  key={`${pair}${base}`}
                  className={`${style["ticker-item"]} ${
                    asset === pair && base === mode ? style["selected"] : ""
                  }`}
                  id={`ticker-${pair}`}
                  href="/p2p"
                  onClick={(e) => {
                    e.preventDefault();
                    setAsset(pair);
                    setBase(mode);
                  }}
                >
                  <div className={style["currency-logo"]}>
                    <img
                      onError={(e) =>
                        (e.currentTarget.src = "/asset/no-image.png")
                      }
                      src={`/asset/${pair.toLowerCase()}.png`}
                      alt={pair}
                      className={style["img"]}
                    />
                  </div>
                  <div className={style["market"]}>
                    <div className={style["market-name"]}>
                      <span className={style["market-name-text"]}>
                        {pair}
                        <span className={style["subtext"]}>/{mode}</span>
                      </span>
                    </div>
                    <div className={style["market-change"]}>
                      <span
                        style={{
                          color:
                            average(pair) >= 0
                              ? "var(--color-green)"
                              : "var(--color-red)",
                        }}
                        className={style["change"]}
                      >
                        {average(pair) >= 0 ? "▲" : "▼"}{" "}
                        {FormatPrice(average(pair), 2)}%
                      </span>
                    </div>
                  </div>
                  <div className={style["price"]}>
                    <div className={style["price-box"]}>
                      <span
                        className={`${style["price-text"]} ${style["ticker-price"]}`}
                      >
                        {FormatCurrency(
                          FormatPrice(pairs[pair]?.[mode]?.PRICE ?? 0),
                          5
                        )}{" "}
                        {mode}
                      </span>
                    </div>
                    {mode != "USD" && (
                      <div className={style["price-box"]}>
                        <span className={style["price-subtext"]}>
                          $
                          {FormatCurrency(
                            FormatPrice(
                              (pairs[pair]?.[mode]?.PRICE ?? 0) *
                                (pairs[mode]?.["USD"]?.PRICE ?? 0)
                            )
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              ))}
          </div>
        </div>
      </Card>
    </>
  );
}
