import { Col, Divider, Row, Typography } from "antd";
import Image from "next/image";
import Link from "next/link";

import LogoImg from "../../public/logo.svg";
import styles from "./footer.module.css";

export default function Footer(props: { fullWidth?: boolean }) {
  return (
    <div
      className="container"
      style={props.fullWidth ? { maxWidth: "100%" } : undefined}
    >
      <Divider />
      <div>
        <Row>
          <Col xs={12} sm={12} md={8}>
            <Typography.Title level={4}>Compliance</Typography.Title>
            <ul className={styles.footerList}>
              <li>
                <Link href="/privacy-policy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="footer-link">
                  Terms of use
                </Link>
              </li>
              <li>
                <Link href="/anti-fraud-policy" className="footer-link">
                  Anti Fraud Policy
                </Link>
              </li>
              <li>
                <Link href="/complaint-management" className="footer-link">
                  Complaint Management
                </Link>
              </li>
              <li>
                <Link href="/bsa-policy" className="footer-link">
                  BSA Policy
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} sm={12} md={8}>
            <Typography.Title level={4}>User Services</Typography.Title>
            <ul className={styles.footerList}>
              <li>
                <Link href="/" className="footer-link">
                  Wallet
                </Link>
              </li>
              <li>
                <Link href="/" className="footer-link">
                  Funds
                </Link>
              </li>
              <li>
                <Link href="/" className="footer-link">
                  Exchange
                </Link>
              </li>
              <li>
                <Link href="/" className="footer-link">
                  Buy and Sell
                </Link>
              </li>
              <li>
                <Link href="/" className="footer-link">
                  Contact Support
                </Link>
              </li>
            </ul>
          </Col>
          <Col xs={12} sm={12} md={8}>
            <Typography.Title level={4}>About</Typography.Title>
            <ul className={styles.footerList}>
              <li>
                <Link href="/" className="footer-link">
                  About InTuition
                </Link>
              </li>
              <li>
                <Link href="/" className="footer-link">
                  Prime Trust
                </Link>
              </li>
              <li>
                <Link href="/" className="footer-link">
                  Listing Enquiry
                </Link>
              </li>
            </ul>
          </Col>
        </Row>
        <Divider />
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <Typography.Paragraph>
            <Image
              alt="InTuition Exchange Logo"
              src={LogoImg}
              style={{ maxWidth: "200px", width: "100%" }}
            />
          </Typography.Paragraph>
          <Typography.Paragraph>Antioch, CA, 94531</Typography.Paragraph>
          <Typography.Text>
            © Intuition Exchange Limited {new Date().getFullYear()}
          </Typography.Text>
        </div>
      </div>
    </div>
  );
}
