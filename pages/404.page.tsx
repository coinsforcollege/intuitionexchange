import { Button, Result } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import { UserAuthContextProvider } from "context/protect-route-user";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";

export function NotFoundPage() {
  const router = useRouter();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => router.push("/")}>
          Back Home
        </Button>
      }
    />
  );
}

NotFoundPage.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Not found | Intuition Exchange</title>
      </Head>
      <UserAuthContextProvider>
        <Header />
        <>{page}</>
        <Footer />
      </UserAuthContextProvider>
    </>
  );
};

export default NotFoundPage;
