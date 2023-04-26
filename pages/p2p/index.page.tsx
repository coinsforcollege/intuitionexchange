import { Col, Row } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { ExchangeContextProvider } from "context/exchange-context";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import React, { ReactElement } from "react";

import { HistoryScreen } from "./history";
import { MatchScreen } from "./match-screen";
import { PairsScreen } from "./pairs";
import { QuoteScreen } from "./quote";

export function Page() {
  const [asset, setAsset] = React.useState("BTC");
  const [baseAsset, setBaseAsset] = React.useState("USD");

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} md={6}>
          <PairsScreen
            base={baseAsset}
            setBase={setBaseAsset}
            asset={asset}
            setAsset={setAsset}
          />
        </Col>
        <Col xs={24} md={10}>
          <div>
            <HistoryScreen />
          </div>
          <div style={{ paddingTop: "1rem" }}>
            <MatchScreen />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <div>
            <QuoteScreen asset={asset} base={baseAsset} />
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
        <Header />
        <div className="container">
          <ExchangeContextProvider>{page}</ExchangeContextProvider>
        </div>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
