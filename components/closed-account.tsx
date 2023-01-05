import { Icon } from "@iconify/react";
import { Result } from "antd";
import Head from "next/head";

import Footer from "./footer";
import Header from "./header";

export function ClosedAccountComponent() {
  return (
    <>
      <Head>
        <title>Not found | Intuition Exchange</title>
      </Head>
      <Header />
      <Result
        icon={
          <Icon icon="line-md:close-circle" fontSize={48} color="#CC0000" />
        }
        status="error"
        title="Your account has been suspended"
        subTitle="We detected some unusual activity. If you feel there has been an error please write to us at compliance@intuitionexchange.com"
      />
      <Footer />
    </>
  );
}
