import { Card, Divider, Radio, Typography } from "antd";
import React from "react";
import { FormatPrice } from "util/functions";

import { ExchangeContext } from "./exchange-context";

export function PairsScreen({
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
      <Card style={{ height: "100%" }}>
        <div>
          <Radio.Group
            onChange={(e) => setMode(e.target.value)}
            value={mode}
            style={{ marginBottom: 8, width: "100%", textAlign: "center" }}
          >
            <Radio.Button value="USD">USD</Radio.Button>
            <Radio.Button value="BTC">BTC</Radio.Button>
            <Radio.Button value="ETH">ETH</Radio.Button>
            <Radio.Button value="ADA">ADA</Radio.Button>
          </Radio.Group>
        </div>
        <Divider />
        <div className="scroll" style={{ height: "600px", overflowY: "auto" }}>
          {Object.keys(pairs)
            .filter((pair) => pair !== mode && pair !== "USD")
            .map((pair) => (
              <div
                style={{ cursor: "pointer" }}
                key={`${pair}${base}`}
                onClick={() => {
                  setAsset(pair);
                  setBase(mode);
                }}
              >
                <div style={{ display: "flex" }}>
                  <img
                    src={`/asset/${pair.toLowerCase()}.png`}
                    alt={pair}
                    width={24}
                    height={24}
                  />
                  <div style={{ paddingLeft: "8px", flexGrow: 1 }}>
                    <Typography>{pair}</Typography>
                  </div>
                  <div>
                    <Typography>
                      {FormatPrice(pairs[pair]?.[mode]?.PRICE ?? 0)} {mode}
                    </Typography>
                  </div>
                </div>
                <Divider />
              </div>
            ))}
        </div>
      </Card>
    </>
  );
}
