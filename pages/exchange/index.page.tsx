import { Col, Form, Row, Select, Space } from "antd";
import Footer from "components/footer";
import AdvancedChart from "components/graphs/AdvancedChart";
import TechnicalAnalysis from "components/graphs/TechnicalAnalysis";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import React, { ReactElement } from "react";
import { assetsList } from "types";

import { QuoteScreen } from "./quote";

export function Page() {
  const [asset, setAsset] = React.useState("BTC");
  const findAsset = assetsList.find((item) => item.code === asset);

  return (
    <>
      <Form.Item label="Asset">
        <Select
          value={asset}
          onChange={(value) => setAsset(value)}
          options={assetsList.map((asset) => ({
            label: asset.name,
            value: asset.code,
          }))}
        />
      </Form.Item>
      <Row gutter={24}>
        <Col xs={24} md={16}>
          <div style={{ minHeight: 400 }}>
            <AdvancedChart
              widgetProps={{
                symbol: `BINANCEUS:${asset}USD`,
                height: 600,
              }}
            />
          </div>
        </Col>
        <Col xs={24} md={8}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <QuoteScreen assetId={findAsset?.assetId} />
            <TechnicalAnalysis
              widgetProps={{
                symbol: `BINANCEUS:${asset}USD`,
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
        <div className="container">{page}</div>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
