import Head from "next/head";
import NotFoundPage from "pages/404.page";

import Footer from "./footer";
import Header from "./header";

export function NotFoundComponent() {
  return (
    <>
      <Head>
        <title>Not found | Intuition Exchange</title>
      </Head>
      <Header />
      <NotFoundPage />;
      <Footer />
    </>
  );
}
