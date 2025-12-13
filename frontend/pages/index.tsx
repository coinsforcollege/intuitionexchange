import Head from "next/head";
import Header, { HEADER_HEIGHT } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import CTASection from "@/components/home/CTASection";
import { theme } from "antd";

const { useToken } = theme;

export default function Home() {
  const { token } = useToken();

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: token.colorBgLayout,
  };

  const mainStyle: React.CSSProperties = {
    flex: 1,
    paddingTop: HEADER_HEIGHT,
  };

  return (
    <>
      <Head>
        <title>InTuition Exchange - The Campus For College Coins</title>
        <meta
          name="description"
          content="Trade university-issued College Coins for tuition, living expenses, or liquidity. Swap between TUIT and major cryptocurrencies with instant settlement."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={pageStyle}>
        <Header />
        <main style={mainStyle}>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </>
  );
}
