import { Col, Row, Spin } from "antd";
import Footer from "components/footer";
import Header, { HeaderKey } from "components/header";
import { ExchangeContextProvider } from "context/exchange-context";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { OrderType } from "types";

import { HistoryScreen } from "./history";
import { MatchScreen } from "./match-screen";
import { PairsScreen } from "./pairs";
import { QuoteScreen } from "./quote";
import { VolumeScreen } from "./volume";

export function Page() {
  const router = useRouter();
  const [selectedBase, setSelectedBase] = React.useState("USD");
  const [orderType, setOrderType] = React.useState<OrderType>(OrderType.Buy);
  const [unit, setUnit] = React.useState(0);
  const [price, setPrice] = React.useState(0);

  const pair = String(router.query.pair);
  const [asset, baseAsset] = pair.split("-");

  React.useEffect(() => {
    if (baseAsset && selectedBase !== baseAsset) {
      setSelectedBase(baseAsset);
    }
  }, [baseAsset]);

  if (!asset || !baseAsset) {
    router.replace("BTC-USD");
    return (
      <div style={{ textAlign: "center", padding: "10rem 0" }}>
        <Spin />
      </div>
    );
  }

  return (
    <>
      <Row gutter={[12, 12]}>
        <Col xs={24} lg={6} xxl={5}>
          <PairsScreen
            selectedBase={selectedBase}
            setSelectedBase={setSelectedBase}
            asset={asset}
            base={baseAsset}
            setPair={(a, b) => {
              router.push(`${a}-${b}`);
            }}
          />
        </Col>
        <Col xs={24} lg={10} xxl={12}>
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
        <Col xs={24} lg={8} xxl={7}>
          <div>
            <QuoteScreen
              asset={asset}
              base={baseAsset}
              orderType={orderType}
              setOrderType={setOrderType}
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
              setOrderType={setOrderType}
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
        <Header fullWidth active={HeaderKey.P2P} />
        <div className="container" style={{ maxWidth: "100%" }}>
          <ExchangeContextProvider>{page}</ExchangeContextProvider>
        </div>
        <Footer fullWidth />
      </UserAuthContextProvider>
    </>
  );
};

export default Page;
