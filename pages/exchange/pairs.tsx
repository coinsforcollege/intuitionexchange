import { SearchOutlined } from "@ant-design/icons";
import { Card, Input } from "antd";
import React from "react";
import { FormatCurrency, FormatPrice } from "util/functions";

import { ExchangeContext } from "./exchange-context";
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
  const [mode, setMode] = React.useState(base);
  const { pairs } = React.useContext(ExchangeContext);

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
              onClick={() => setMode("ADA")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                mode === "ADA" ? style["active"] : ""
              }`}
            >
              ADA
            </label>
          </div>
        </div>
        <div style={{ padding: "12px 24px" }}>
          <Input
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
            {Object.keys(pairs)
              .filter((pair) => pair !== mode && pair !== "USD")
              .map((pair) => (
                <a
                  key={`${pair}${base}`}
                  className={`${style["ticker-item"]} ${
                    asset === pair && base === mode ? style["selected"] : ""
                  }`}
                  id={`ticker-${pair}`}
                  href="/exchange"
                  onClick={(e) => {
                    e.preventDefault();
                    setAsset(pair);
                    setBase(mode);
                  }}
                >
                  <div className={style["currency-logo"]}>
                    <img
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
                          color: "var(--color-red)",
                        }}
                        className={style["change"]}
                      >
                        ▼ -12.15%
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
