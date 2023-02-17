import { Col, Row, Space } from "antd";
import Footer from "components/footer";
import AdvancedChart from "components/graphs/AdvancedChart";
import TechnicalAnalysis from "components/graphs/TechnicalAnalysis";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import React, { ReactElement } from "react";

import { ExchangeContextProvider } from "./exchange-context";
import { HistoryScreen } from "./history";
import { PairsScreen } from "./pairs";
import { QuoteScreen } from "./quote";

export function Page() {
  const [asset, setAsset] = React.useState("BTC");
  const [baseAsset, setBaseAsset] = React.useState("USD");

  return (
    <>
      <Row gutter={24}>
        <Col xs={24} md={5}>
          <PairsScreen
            base={baseAsset}
            setBase={setBaseAsset}
            asset={asset}
            setAsset={setAsset}
          />
        </Col>
        <Col xs={24} md={12}>
          <div>
            <AdvancedChart
              widgetProps={{
                symbol: `${asset}${baseAsset}`,
                height: 400,
                toolbar_bg: "transparent",
                hide_side_toolbar: true,
              }}
            />
          </div>
          <div style={{ paddingTop: "1rem" }}>
            <HistoryScreen />
          </div>
        </Col>
        <Col xs={24} md={7}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <QuoteScreen asset={asset} base={baseAsset} />
            <TechnicalAnalysis
              widgetProps={{
                symbol: `${asset}${baseAsset}`,
                width: "100%",
                height: 420,
              }}
            />
          </Space>
        </Col>
      </Row>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Exchange | Intuition Exchange</title>
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
