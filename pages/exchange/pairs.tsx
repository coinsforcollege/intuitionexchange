import { SearchOutlined } from "@ant-design/icons";
import { Card, Input } from "antd";
import { ExchangeContext } from "context/exchange-context";
import { useRouter } from "next/router";
import React from "react";
import { PreciseCalculation } from "util/calculation";
import { FormatCurrency } from "util/functions";

import style from "./pairs.module.css";

export function PairsScreen({
  asset,
  base,
  selectedBase,
  setBase,
  setAsset,
  setSelectedBase,
}: {
  asset: string;
  base: string;
  selectedBase: string;
  setAsset: React.Dispatch<React.SetStateAction<string>>;
  setBase: React.Dispatch<React.SetStateAction<string>>;
  setSelectedBase: React.Dispatch<React.SetStateAction<string>>;
}) {
  const router = useRouter();
  const [search, setSearch] = React.useState("");
  const { pairs } = React.useContext(ExchangeContext);

  const average = (pair: string) => {
    const price = pairs[pair]?.[selectedBase]?.price ?? 0;
    const openDay = pairs[pair]?.[selectedBase]?.openDay ?? 0;
    const difference = PreciseCalculation.multiplication(
      PreciseCalculation.division(
        PreciseCalculation.subtraction(price, openDay),
        openDay
      ),
      100
    );

    return PreciseCalculation.round(difference);
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
              onClick={() => setSelectedBase("USD")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                selectedBase === "USD" ? style["active"] : ""
              }`}
            >
              USD
            </label>
            <label
              onClick={() => setSelectedBase("BTC")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                selectedBase === "BTC" ? style["active"] : ""
              }`}
            >
              BTC
            </label>
            <label
              onClick={() => setSelectedBase("ETH")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                selectedBase === "ETH" ? style["active"] : ""
              }`}
            >
              ETH
            </label>
            <label
              onClick={() => setSelectedBase("USDT")}
              className={`${style["btn"]} ${style["btn-primary"]} ${
                selectedBase === "USDT" ? style["active"] : ""
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
            {Object.keys(pairs)
              .sort((a, b) => a.localeCompare(b))
              .filter(
                (pair) =>
                  pair !== selectedBase &&
                  pair !== "USD" &&
                  pair !== "TUIT" &&
                  pair.toLowerCase().startsWith(search)
              )
              .map((pair) => (
                <a
                  key={`${pair}${base}`}
                  className={`${style["ticker-item"]} ${
                    asset === pair && base === selectedBase
                      ? style["selected"]
                      : ""
                  }`}
                  id={`ticker-${pair}`}
                  href="/p2p"
                  onClick={(e) => {
                    e.preventDefault();
                    setAsset(pair);
                    setBase(selectedBase);
                    router.replace({
                      query: {
                        pair: `${pair}-${selectedBase}`,
                      },
                    });
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
                        <span className={style["subtext"]}>
                          /{selectedBase}
                        </span>
                      </span>
                    </div>
                    <div className={style["market-change"]}>
                      <span
                        style={{
                          color:
                            average(pair) < 0
                              ? "var(--color-red)"
                              : "var(--color-green)",
                        }}
                        className={style["change"]}
                      >
                        {average(pair) < 0 ? "▼" : "▲"} {average(pair)}%
                      </span>
                    </div>
                  </div>
                  <div className={style["price"]}>
                    <div className={style["price-box"]}>
                      <span
                        className={`${style["price-text"]} ${style["ticker-price"]}`}
                      >
                        {FormatCurrency(
                          PreciseCalculation.round(
                            pairs[pair]?.[selectedBase]?.price ?? 0
                          )
                        )}{" "}
                        {selectedBase}
                      </span>
                    </div>
                    {selectedBase != "USD" && (
                      <div className={style["price-box"]}>
                        <span className={style["price-subtext"]}>
                          $
                          {FormatCurrency(
                            PreciseCalculation.round(
                              (pairs[pair]?.[selectedBase]?.price ?? 0) *
                                (pairs[selectedBase]?.["USD"]?.price ?? 0)
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
