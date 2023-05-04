import { Col, Row } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { ExchangeContextProvider } from "context/exchange-context";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import React, { ReactElement } from "react";
import { OrderType } from "types";

import { HistoryScreen } from "./history";
import { MatchScreen } from "./match-screen";
import { PairsScreen } from "./pairs";
import { QuoteScreen } from "./quote";
import { VolumeScreen } from "./volume";

export function Page() {
  const [asset, setAsset] = React.useState("BTC");
  const [baseAsset, setBaseAsset] = React.useState("USD");
  const [mode, setMode] = React.useState<OrderType>(OrderType.Buy);
  const [unit, setUnit] = React.useState(0);
  const [price, setPrice] = React.useState(0);

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} md={6} xxl={3}>
          <PairsScreen
            base={baseAsset}
            setBase={setBaseAsset}
            asset={asset}
            setAsset={setAsset}
          />
        </Col>
        <Col xs={24} md={10} xxl={16}>
          <div>
            <HistoryScreen />
          </div>
          <div style={{ paddingTop: "1rem" }}>
            <MatchScreen
              asset={asset}
              base={baseAsset}
              unit={unit}
              setUnit={setUnit}
              price={price}
              setPrice={setPrice}
            />
          </div>
        </Col>
        <Col xs={24} md={8} xxl={5}>
          <div>
            <QuoteScreen
              asset={asset}
              base={baseAsset}
              mode={mode}
              setMode={setMode}
              unit={unit}
              setUnit={setUnit}
              price={price}
              setPrice={setPrice}
            />
          </div>
          <div style={{ paddingTop: "1rem" }}>
            <VolumeScreen
              asset={asset}
              base={baseAsset}
              setMode={setMode}
              unit={unit}
              setUnit={setUnit}
              price={price}
              setPrice={setPrice}
            />
          </div>
        </Col>
      </Row>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>P2P | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header fullWidth />
        <div className="container" style={{ maxWidth: "100%" }}>
          <ExchangeContextProvider>{page}</ExchangeContextProvider>
        </div>
        <Footer fullWidth />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
