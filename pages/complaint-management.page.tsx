import { Typography } from "antd";
import Footer from "components/footer";
import Header from "components/header";
import Head from "next/head";
import { ReactElement } from "react";

export function Page() {
  return (
    <>
      <div className="container">
        <Typography.Title>
          <strong>Complaint Management</strong>
        </Typography.Title>
        <Typography.Title level={3}>
          <strong>Complaints</strong>
        </Typography.Title>
        <ul>
          <li>
            <Typography.Paragraph>
              <strong>Submitting A Complaint</strong>. If you have a complaint,
              you may first open a ticket with Customer Service and work with
              Customer Service to resolve your issue. Once you have already done
              so, and Customer Service has been unable to resolve your issue,
              please email your complaint to&nbsp;
              <a href="mailto:resolutions@binance.us">
                support@intuitionexchange.org
              </a>
              . In that email, you must provide your Customer Service ticket
              number, state the cause of your complaint, how you would like us
              to resolve the complaint, and any other information you believe to
              be relevant. Without a Customer Service ticket, your complaint
              email will be deemed premature and will not receive a response.
              Upon receiving your complaint, we will open a support ticket and a
              user complaints officer (
              <strong>&ldquo;Complaint Officer&rdquo;</strong>) will review your
              complaint. The Complaint Officer will review your complaint
              without prejudice, based on the information you provided and any
              information we may derive from our records. Within thirty business
              days ((all days excluding Saturday, Sundays, and any bank holiday
              in the State of California) (
              <strong>&ldquo;Business Days&rdquo;</strong>)) of our receipt of
              your complaint, the Complaint Officer will use reasonable efforts
              to address the points raised in your complaint and the Complaint
              Officer may: (1) offer to resolve your complaint in the way you
              have requested; (2) reject your complaint and set out the reasons
              for the rejection; or (3) offer to resolve your complaint with an
              alternative proposal or solution. In exceptional circumstances, if
              the Complaint Officer is unable to respond to your complaint
              within thirty Business Days, the Complaint Officer will use
              reasonable efforts to send you a holding response indicating the
              reasons for a delay in answering your complaint and specifying the
              deadline by which the Complaint Officer will respond to your
              complaint.
            </Typography.Paragraph>
          </li>
          <li>
            <Typography.Paragraph>
              <strong>Offers</strong>. Any offer of resolution made to you will
              only become binding on Intuition Exchange if accepted by you. An
              offer of resolution will not constitute any admission by us of
              wrongdoing or liability regarding the complaint&rsquo;s subject
              matter.
            </Typography.Paragraph>
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Arbitration</strong>
        </Typography.Title>
        <Typography.Paragraph>
          INTUITION EXCHANGE and you agree that any dispute or controversy
          arising out of or relating to these Terms or the INTUITION EXCHANGE
          Services, including, but not limited to, legal and equitable claims,
          federal and state statutory claims, common law claims, and those based
          in contract, tort, fraud, misrepresentation or any other legal theory,
          shall be resolved through binding arbitration on an individual basis
          (except as specifically noted below). Arbitration shall be conducted
          in accordance with the rules of the American Arbitration Association (
          <strong>&ldquo;AAA&rdquo;</strong>), Consumer Arbitration Rules. In
          agreeing to this binding commitment to arbitrate their claims,
          INTUITION EXCHANGE and you agree that they waive any right to proceed
          in a court of law or to have their claims heard by a jury. The
          arbitration shall: (1) be conducted by a single, neutral arbitrator in
          the English language; (2) be held virtually and not in person for all
          proceedings related to the arbitration, except by mutual agreement of
          all parties; and (3) be limited to one deposition per party, except by
          mutual agreement of all parties or upon a showing of need.
          Furthermore, in cases where neither party&rsquo;s claim(s) or
          counterclaim(s) exceed $25,000, both parties agree to waive an
          arbitration hearing and resolve the dispute solely through submissions
          of documents to the arbitrator. The AAA rules, as well as instructions
          on how to file an arbitration proceeding with the AAA, appear at
          adr.org, or you may call the AAA at 1-800-778-7879.
          <br />
          <br /> Without waiving or otherwise affecting the Class Action Waiver
          below, in the event that your claim(s) in an arbitration substantially
          implicate or relate to the rights of, or claims by, other INTUITION
          EXCHANGE customers who have also initiated arbitration against
          INTUITION EXCHANGE, you agree that INTUITION EXCHANGE shall have the
          right, but not the obligation, to join or consolidate such
          arbitrations into a single arbitration, in INTUITION EXCHANGE&rsquo;s
          sole discretion.
          <br />
          <br /> Confidentiality. During the arbitration, the amount of any
          settlement offer made by you or INTUITION EXCHANGE shall not be
          disclosed to the arbitrator until after the arbitrator makes a final
          decision and award, if any. All documents and information disclosed in
          the course of the arbitration shall be kept strictly confidential by
          the recipient and shall not be used by the recipient for any purpose
          other than for purposes of the arbitration or the enforcement of the
          arbitrator&rsquo;s decision and award and shall not be disclosed
          except in confidence to persons who have a need to know for such
          purposes or as required by applicable law.&nbsp;
          <strong>Delegation</strong>. Any dispute between INTUITION EXCHANGE
          and You regarding the construction, interpretation, or application of
          this arbitration provision, including the enforceability,
          severability, revocability, scope, or validity of this arbitration
          provision, shall be decided by an arbitrator and not by a court or
          judge.
        </Typography.Paragraph>
      </div>
    </>
  );
}

Page.GetLayout = function GetLayout(page: ReactElement) {
  return (
    <>
      <Head>
        <title>Privacy Policy | Intuition Exchange</title>
      </Head>
      <Header />
      <>{page}</>
      <Footer />
    </>
  );
};

export default Page;
