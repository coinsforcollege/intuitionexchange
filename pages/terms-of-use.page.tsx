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
          <strong>TERMS OF USE</strong>
        </Typography.Title>
        <Typography.Paragraph>
          <strong>Last updated: December 7, 2022</strong>
        </Typography.Paragraph>
        <Typography.Paragraph>
          Welcome to Intuition Exchange. These Terms of Use (
          <strong>&ldquo;Terms&rdquo;</strong>) govern your access and use of
          Intuition Exchange and the Services provided by INTUITION EXCHANGE.
          (&ldquo;our,&rdquo; &ldquo;we,&rdquo;&nbsp;<strong>&ldquo;</strong>
          <strong>INTUITION EXCHANGE&rdquo;</strong>&nbsp;). Our services
          include: (1) the content on our website located at Intuition Exchange
          (<strong>&ldquo;Website&rdquo;</strong>) or any other websites, pages,
          features, or content we own or operate (collectively, the&nbsp;
          <strong>&ldquo;</strong>
          <strong>Sites&rdquo;</strong>) or when you use our mobile app; (2) any
          application program interface (<strong>&ldquo;API&rdquo;</strong>)
          made available by INTUITION EXCHANGE to you as a service or
          third-party applications relying on such an API (
          <strong>&ldquo;</strong>
          <strong>INTUITION EXCHANGE APIs&rdquo;</strong>); (3) the Platform
          (defined below) which provides Digital Asset (defined below) trading
          services (<strong>&ldquo;Trading Services&rdquo;</strong>); (4)
          staking, through third parties or otherwise, of Digital Assets that
          you may designate (<strong>&ldquo;Staking Services&rdquo;</strong>) by
          INTUITION EXCHANGE or entities undertaking Staking Services on
          INTUITION EXCHANGE&rsquo;s behalf; and (5) and any other services that
          INTUITION EXCHANGE may make available, directly or indirectly, from
          time to time (collectively, the&nbsp;
          <strong>&ldquo;Services&rdquo;</strong>).
        </Typography.Paragraph>
        <Typography.Paragraph>
          Please read these Terms, our&nbsp;Disclosures,&nbsp;Privacy
          Policy&nbsp;(including the Biometric Data Policy), and&nbsp;Trading
          Rules&nbsp;and any other terms referenced in this document carefully.
          The Terms you see below are important because they:
        </Typography.Paragraph>
        <ul>
          <li>Outline your legal rights.</li>
          <li>
            Explain the rights you give to us and our parents, subsidiaries,
            affiliates, entities under common ownership, or otherwise related
            parties (&ldquo;Related Parties&rdquo;) when you use our Services.
          </li>
          <li>
            Describe the rules you must follow when using our Services; and
          </li>
          <li>
            Contain a class action waiver and an agreement to resolve any
            disputes that may arise by arbitration.
          </li>
          <li>
            Contain a clause that delegates decisions regarding the
            interpretation and application of the arbitration clause to an
            arbitrator and not to a court or judge.
          </li>
        </ul>
        <Typography.Paragraph>
          You agree that you have read, understand, and accept these Terms by
          signing up for an Account(s) (defined below) with INTUITION EXCHANGE,
          accessing our Website, or INTUITION EXCHANGE APIs (where available).
          If you do not agree with these Terms, you may not, and are prohibited
          from, access or use of the Services, Sites, or any other aspect of our
          business.
        </Typography.Paragraph>
        <Typography.Paragraph>
          We may amend or modify these Terms at any time by posting the revised
          Terms on the Website and/or providing a copy to you (&ldquo;Revised
          Terms&rdquo;). The Revised Terms shall be effective as of the time
          they are posted, but will not apply retroactively. Your continued use
          of the Services after the posting of Revised Terms constitutes your
          acceptance of such Revised Terms. If you do not agree with any such
          modification, your sole and exclusive remedy is to terminate your use
          of the Services and close your Account.
        </Typography.Paragraph>
        <Typography.Paragraph>
          <strong>
            PLEASE BE AWARE THAT THESE TERMS CONTAIN PROVISIONS REGARDING THE
            RESOLUTION OF DISPUTES BETWEEN YOU AND INTUITION EXCHANGE, INCLUDING
            AN AGREEMENT TO ARBITRATE WHICH REQUIRES, WITH LIMITED EXCEPTIONS,
            THAT ALL DISPUTES BETWEEN YOU AND INTUITION EXCHANGE SHALL BE
            RESOLVED BY BINDING ARBITRATION. THESE TERMS ALSO CONTAIN A WAIVER
            OF YOUR RIGHT TO A JURY TRIAL AND A WAIVER OF YOUR RIGHT TO
            PARTICIPATE IN A CLASS ACTION. PLEASE READ THESE SECTIONS OF THE
            TERMS CAREFULLY.
          </strong>
        </Typography.Paragraph>
        <Typography.Paragraph>
          Buying, selling, and holding cryptocurrencies are activities that are
          subject to high market risk. The volatile and unpredictable nature of
          the price of cryptocurrencies may result in a significant loss.
          INTUITION EXCHANGE is not responsible for any loss that you may incur
          from price fluctuations when you buy, sell, or hold cryptocurrencies.
          INTUITION EXCHANGE does not provide investment, legal, or tax advice
          in any manner or form. The ownership of any investment decision(s)
          exclusively vests with you after analyzing all possible risk factors
          and by exercising your own independent discretion. INTUITION EXCHANGE
          shall not be liable for any consequences thereof.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Your use of the Services is subject to additional terms and
          conditions, which are incorporated into these Terms:
        </Typography.Paragraph>
        <ul>
          <li>Disclosures;</li>
          <li>Privacy Policy, and the included Biometric Data Policy; and</li>
          <li>Trading Rules.</li>
        </ul>
        <Typography.Paragraph>
          <strong>Table Of Contents</strong>
        </Typography.Paragraph>
        <ul>
          <li>Binding Contract</li>
          <li>Eligibility</li>
          <li>Use Of The Services</li>
          <li>Account Creation</li>
          <li>Transactions</li>
          <li>Trading Risks</li>
          <li>Instructions</li>
          <li>Communications; E-Sign Disclosure and Consent</li>
          <li>Termination, Suspension, or Restriction</li>
          <li>Prohibited Use</li>
          <li>Prohibited Businesses</li>
          <li>Representations And Warranties</li>
          <li>Covenants</li>
          <li>Liability</li>
          <li>Data Protection</li>
          <li>Intellectual Property</li>
          <li>Trademarks</li>
          <li>Feedback</li>
          <li>Chat</li>
          <li>General Terms</li>
          <li>Complaints</li>
          <li>Arbitration</li>
          <li>Class Action Waiver</li>
          <li>Contact Us</li>
          <li>State License Disclosures</li>
        </ul>
        <Typography.Title level={3}>
          <strong>Binding Contract</strong>
        </Typography.Title>
        <Typography.Paragraph>
          These Terms form a binding contract between you and INTUITION
          EXCHANGE. Please read these Terms carefully. You agree that you have
          read, understand, and accept these Terms by signing up for an
          Account(s) with INTUITION EXCHANGE, accessing our Website, or
          INTUITION EXCHANGE APIs (where available). If you do not agree with
          these Terms, you may not access, and are prohibited from accessing or
          using the Services, Sites, or any other aspect of our business.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>Eligibility</strong>
        </Typography.Title>
        <Typography.Paragraph>
          To be eligible to use the Services, you must satisfy the following:
        </Typography.Paragraph>
        <ul>
          <li>
            You must be an individual, corporation, legal person, entity, or
            other organization in a location in which INTUITION EXCHANGE
            Services are available with the full power, authority, and capacity
            to (1) access and use our Services and (2) enter into, deliver, and
            perform your obligations under these Terms. If you are an
            individual, you must be at least 18 years old.
          </li>
          <li>
            <strong>Eligible Person</strong>. Except as otherwise provided for
            in this agreement, you are an Eligible Person if you are not a
            resident of a Restricted State or other location in which INTUITION
            EXCHANGE is not authorized to do business and provided you satisfy
            one of the following criteria:
            <ul>
              <li>
                a citizen of the United States of America (&ldquo;S.&rdquo;) or
                any other location in which INTUITION EXCHANGE is authorized to
                do business;
              </li>
              <li>
                a U.S. resident - meaning (1) a green card holder; or (2) an
                individual physically present in the U.S. for 31 days in the
                current calendar year and 183 days during the three-year period
                that includes the current year and the two years immediately
                before that, counting: (a) all the days present in the U.S. in
                the current year; (b). 1/3 of the days present in the U.S. in
                the first year before the current year; and (c) 1/6 of the days
                present in the U.S. in the second year before the current year;
                (3) an individual designated a resident for U.S. tax purposes;
                or (4) an individual with a U.S. mailing address;
              </li>
              <li>
                a corporation, partnership, or entity organized or existing
                under the laws of any state, territory or possession of the
                U.S., or of any other location at INTUITION EXCHANGE&rsquo;s
                sole and absolute discretion;
              </li>
              <li>
                a corporation, partnership, or entity organized or existing
                under the laws of any state, territory or possession of the
                U.S., or of any other location at INTUITION EXCHANGE&rsquo;s
                sole and absolute discretion;
              </li>
              <li>
                an estate or trust of which any executor, administrator, or
                trustee is an Eligible Person;
              </li>
              <li>
                an agency or branch of a foreign entity located in a location
                which INTUITION EXCHANGE is authorized to do business;
              </li>
              <li>
                a discretionary or non-discretionary account held by a fiduciary
                for the benefit or account of an Eligible Person;
              </li>
              <li>
                a non-U.S. partnership, corporation, or entity owned or
                controlled by a Eligible Person (ownership of 10% or more by a
                Eligible Person) and all such non-U.S. entities will be subject
                to enhanced scrutiny by Intuition Exchange&rsquo;s compliance
                function;
              </li>
            </ul>
          </li>
          <li>
            <strong>&ldquo;Restricted States&rdquo;</strong>means Connecticut
            (CT), Hawaii (HI), New York (NY), North Carolina (NC), South Dakota
            (SD) and Texas (TX). The list of Restricted States is subject to
            change at any time. In the event a state becomes a Restricted State,
            INTUITION EXCHANGE will provide users residing in that state with
            notice via email, a notification on the Website, or other means
            deemed necessary regarding their access to the Services.
          </li>
          <li>
            <strong>Representations And Warranties</strong>. You agree that all
            of your representations and warranties, as set out in these Terms,
            are at all times true, accurate, and complete.
          </li>
          <li>
            <strong>Covenants</strong>. You agree that you have and will perform
            all of your covenants, agreements, obligations or undertakings as
            set out in these Terms.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Use Of The Services</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Digital Assets Trading Platform</strong>. INTUITION EXCHANGE
            operates a platform (<strong>&ldquo;Platform&rdquo;</strong>) that
            provides you with Trading Services for digital assets (also known as
            a &lsquo;cryptocurrency&rsquo; or &lsquo;virtual currency&rsquo;),
            which is issued, stored, and/or transferred based on the protocol of
            a computer network known as a blockchain or a public transaction
            ledger (<strong>&ldquo;Digital Assets&rdquo;</strong>). You may use
            the Platform to execute the following trades: (1) sale of a Digital
            Asset for fiat or another Digital Asset; and (2) purchase of a
            Digital Asset with fiat or another Digital Asset.
          </li>
          <li>
            <strong>Staking Services</strong>. INTUITION EXCHANGE provides the
            option to contribute and earn rewards by participating in on-chain
            staking for certain Digital Assets eligible for staking (the
            &ldquo;Eligible Tokens&rdquo;), subject to the terms and conditions
            of these Terms. You may be eligible to stake Digital Assets in a
            third-party proof of stake network via the Staking Services.
            INTUITION EXCHANGE may perform any or all of the Staking Services
            described in these Terms directly or through one or more service
            provider(s). If you designate Digital Assets for the Staking
            Services, INTUITION EXCHANGE will stake the designated Digital
            Assets either (a) by delegating such Digital Assets to a third-party
            staking service provider (&ldquo;Staking Services Provider&rdquo;)
            or Related Party, or (b) by acting as a transaction validator on the
            applicable network for the Digital Asset being staked. If INTUITION
            EXCHANGE or the Staking Services Provider successfully validates a
            block of transactions in a particular Digital Asset, you may earn a
            reward granted by that Digital Asset&rsquo;s network. The reward
            will be determined by the protocols of the applicable network.
            <br /> In order to use the Staking Services, you must opt-in by
            selecting the Eligible Tokens to stake from your Account. You retain
            ownership of the Eligible Tokens and such Eligible Tokens shall
            remain your property when staked under the terms of this Agreement.
            Upon opting-in a portion or your entire balance of Eligible Tokens,
            INTUITION EXCHANGE shall remit to you the applicable percentage of
            staking rewards received from the Eligible Token protocol
            attributable to your staked Eligible Tokens (&ldquo;Staking
            Rewards&rdquo;) as detailed in your Account and the INTUITION
            EXCHANGE&nbsp;website. The applicable percentage and timing of such
            remittances will: (i) be determined by INTUITION EXCHANGE in its
            sole and absolute discretion; (ii) be subject to INTUITION
            EXCHANGE&rsquo;s staking fee; (iii) vary by the Eligible Token
            protocol; and (iv) be further detailed in your Account. You agree
            and understand that neither INTUITION EXCHANGE or its Related
            Parties, nor any Staking Services Provider guarantees that you will
            receive Staking Rewards and that the applicable percentage (i) is an
            estimate only and not guaranteed, (ii) may change at any time in
            INTUITION EXCHANGE&rsquo;s sole and absolute discretion, and (iii)
            may be more or less than the actual staking rewards INTUITION
            EXCHANGE or any Staking Services Provider receives from the Eligible
            Token protocol.
            <br /> Eligible Assets withdrawn by you from the Staking Services
            may be subject to certain bonding and unbonding periods imposed by
            the protocol for which you have staked your Eligible Tokens (
            <strong>&ldquo;Unstaking Period&rdquo;</strong>). During the
            Unstaking Period, you will not continue to earn Rewards and the
            Eligible Tokens may not be available to you until the Unstaking
            Period has fully passed.
            <br /> Your funds&rsquo; private keys may be held in either hot or
            cold storage (in a wallet), as determined solely by INTUITION
            EXCHANGE in accordance with its internal security policies and
            procedures. You should also know that your funds, as well as funds
            belonging to other customers, may be staked to a proof-of-stake
            validator node so as to enable our Staking Services offering, as
            described in these Terms of Service.
            <br /> While INTUITION EXCHANGE and/or the Staking Service Provider
            employ measures to ensure that the Staking Services are accessible
            24 hours a day and 7 days a week, neither INTUITION EXCHANGE nor the
            Staking Service Provider can guarantee uninterrupted or error-free
            operation of the Staking Services or that INTUITION EXCHANGE and/or
            the Staking Service Provider will correct all defects or prevent
            third-party disruptions or unauthorized third party access. In the
            event of such disruptions, any staked Eligible Tokens may not be
            generating the Staking Rewards. INTUITION EXCHANGE will use
            commercially reasonable efforts to continue to provide Staking
            Services, directly, through a Related Party or via a Staking
            Services Provider, with respect to any Eligible Assets for which you
            are using Staking Services, but may elect to terminate Staking
            Services for any Eligible Asset at any time. You are not required to
            stake with INTUITION EXCHANGE to maintain an Account(s) or use our
            Services. You may opt-in or opt-out of Staking Services at any time.
            <br /> Some token protocols may subject staked assets to a
            &ldquo;slashing&rdquo; penalty and non-payment of the applicable
            Staking Rewards if the transaction validator incorrectly validates a
            transaction. INTUITION EXCHANGE will use commercially reasonable
            efforts to prevent any staked assets from slashing; however, in the
            event they are, unless otherwise provided in this Agreement,
            INTUITION EXCHANGE agrees to compensate you for any slashing
            penalties to the extent such penalties are not a result of (i) your
            acts or omissions, (ii) token protocol maintenance, bugs, or errors,
            (iii) acts by a hacker or other malicious actor, or (iv) Force
            Majeure Events as defined in the General .<br /> You acknowledge and
            agree that (a) the continued ability to provide the Staking Services
            is dependent on elements beyond INTUITION EXCHANGE&rsquo;s, any
            Related Party&rsquo;s or the Staking Services Provider&rsquo;s
            control, (b) the staking of Eligible Assets or the use of the
            Staking Services may become subject to regulatory controls that
            limit, restrict, prohibit or otherwise impose conditions on such
            activities; and (c) the Staking Services may become subject to
            regulatory controls that limit, restrict, prohibit or otherwise
            impose conditions on such Staking Services.
          </li>
          <li>
            <strong>Ethereum Staking</strong>. In addition to the terms outlined
            above, the following terms apply when you stake ETH using INTUITION
            EXCHANGE&rsquo;s Staking Services.
            <ul>
              <li>
                <strong>Lockup Period</strong>. If you decide to stake ETH, you
                will not be able to access or use your ETH in any way until the
                Ethereum blockchain&rsquo;s transition to Ethereum
                Proof-of-Stake is complete, and a major network upgrade has
                taken place. INTUITION EXCHANGE does not control the Ethereum
                blockchain and therefore has no control over the timing or
                completion of these upgrades, nor will INTUITION EXCHANGE be
                able to unstake your ETH for you until after these upgrades have
                taken place. The Ethereum blockchain&rsquo;s transition to
                Ethereum Proof-of-Stake may be significantly delayed or fail to
                occur at all. There is no guarantee that other potential
                setbacks will not take place which could cause your staked ETH
                to remain staked and therefore inaccessible by you or INTUITION
                EXCHANGE.
              </li>
              <li>
                <strong>No Guarantee of Success of Upgrade</strong>. There is a
                risk that the transition to Ethereum Proof-of-Stake will fail or
                not occur. Due to the complicated technical nature of this
                transition, there is no guarantee that there will ever be a
                successful completion date of the transition. If the network
                upgrade ultimately fails, you may lose all, or a portion of,
                your staked ETH. INTUITION EXCHANGE will not be responsible for
                any ETH lost due to a network upgrade failure, or the value of
                any ETH lost while it remains staked.
              </li>
              <li>
                <strong>ETH Staking Rewards</strong>. Any rewards you accrue
                from staking ETH will remain locked on the Ethereum blockchain,
                and cannot be accessed by INTUITION EXCHANGE or by you, until
                the network upgrade is complete. Any ETH Rewards reflected in
                your account during the lockup period are an estimate only and
                not guaranteed. You agree and understand that neither INTUITION
                EXCHANGE nor its Related Parties, nor any Staking Services
                Provider guarantees that you will receive ETH Staking Rewards
                and that the applicable rewards rate (i) is an estimate only,
                (ii) may change at any time in INTUITION EXCHANGE&rsquo;s sole
                and absolute discretion, and (iii) may be more or less than the
                actual staking rewards INTUITION EXCHANGE or any Staking
                Services Provider receives from the Eligible Token protocol.
              </li>
            </ul>
          </li>
          <li>
            <strong>Other Services</strong>. INTUITION EXCHANGE may make
            available other services from time to time, which shall be subject
            to such terms and conditions as may be established by INTUITION
            EXCHANGE and published on the Sites.
          </li>
          <li>
            <strong>Product Offerings</strong>. INTUITION EXCHANGE may make
            available new products or modify existing products without seeking
            your consent. Additional terms and conditions may apply to new or
            modified product offerings.
          </li>
          <li>
            <strong>Fees</strong>. INTUITION EXCHANGE&rsquo;s fees are available
            for your reference on our&nbsp;Fee Structure By using the Services,
            you agree to pay all applicable fees. INTUITION EXCHANGE may adjust
            fees from time to time.
          </li>
          <li>
            <strong>Third-Party Payment Partners</strong>.&nbsp;We may use a
            third-party payment processor to process any U.S. dollar payment
            between you and INTUITION EXCHANGE, including but not limited to
            withdrawals or deposits to your INTUITION EXCHANGE Fiat Wallet or
            Linked Wallet, as applicable. The name on your linked bank account
            must match the name verified on your Account(s).
          </li>
          <li>
            <strong>Fiat Currency</strong>. U.S. dollar deposits associated with
            your Account(s) and available for use in executing trades are
            accessible via either (i) a third-party Linked Wallet operated by
            Prime Trust, LLC, which balances are subject to the additional terms
            set forth in the&nbsp;Linked Wallet Addendum, as well as the terms
            of service between you and Prime Trust, LLC; or (ii) a stored value
            wallet issued by INTUITION EXCHANGE denominated in U.S. dollars (
            <strong>&ldquo;</strong>
            <strong>INTUITION EXCHANGE Fiat Wallet&rdquo;</strong>).
            <br />
            <br />
            <ul>
              <li>
                <strong>INTUITION EXCHANGE Fiat Wallet</strong>. All U.S. dollar
                deposits associated with your INTUITION EXCHANGE Fiat Wallet are
                owned by you and held in an omnibus account for the sole benefit
                of customers at Silvergate Bank, a California state-chartered
                bank that is a member of the Federal Deposit Insurance
                Corporation (&ldquo;FDIC&rdquo;) . Title to your INTUITION
                EXCHANGE Fiat Wallet, in addition to the U.S. dollar deposits
                associated with your INTUITION EXCHANGE Fiat Wallet, shall at
                all times remain with you. INTUITION EXCHANGE Fiat Wallets have
                been established with the intention that U.S. dollars deposited
                in such INTUITION EXCHANGE Fiat Wallets be eligible for FDIC
                pass-through insurance, up to the per-depositor coverage limit
                then in place (currently $250,000 per eligible individual),
                assuming regulatory requirements are met. FDIC insurance does
                not protect against the failure of INTUITION EXCHANGE or
                malfeasance by any INTUITION EXCHANGE employee. Digital assets
                are not eligible for FDIC insurance protections. FDIC
                pass-through insurance protects your U.S. dollars deposited in
                your INTUITION EXCHANGE Fiat Wallet against the risk of loss in
                the event Silvergate Bank fails, subject to applicable
                limitations and assuming specific deposit insurance requirements
                are met. It is our policy to comply with the regulations and
                other requirements of the FDIC for pass-through deposit
                insurance. INTUITION EXCHANGE will maintain records of your
                ownership of U.S. dollar deposits associated with your INTUITION
                EXCHANGE Fiat Wallet, in a manner reasonably understood to
                satisfy the FDIC&rsquo;s requirements for obtaining
                &ldquo;pass-through&rdquo; deposit insurance. All U.S. dollar
                deposits associated with a INTUITION EXCHANGE Fiat Wallet and
                held in the omnibus account at Silvergate Bank are held apart
                from INTUITION EXCHANGE&rsquo;s corporate funds and INTUITION
                EXCHANGE will never use funds held in the omnibus account at
                Silvergate Bank for its operating expenses or any other
                corporate purposes. In the event we terminate our relationship
                with Silvergate Bank, the balance associated with your INTUITION
                EXCHANGE Fiat Wallet will neither be affected nor will the
                transfer of such funds from Silvergate to another U.S. bank
                jeopardize the availability of FDIC insurance, subject to
                applicable limitations and assuming regulatory requirements are
                met.
              </li>
            </ul>
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Account Creation</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Setup</strong>. Full use of our Services requires that you
            create your Account(s) by: (1) providing us with information such as
            your full name, email address (temporary, disposable,
            self-destructive or similar email addresses are prohibited), current
            home address and such other information as we may require; (2)
            selecting a strong password or PIN; and (3) accepting these Terms.
            INTUITION EXCHANGE reserves sole and absolute discretion to accept
            or reject any application for any reason or for no reason
            whatsoever, or limit the number of Account(s) that you may hold.
            Under no circumstances shall any of the Indemnified Persons (defined
            below) be responsible or liable to you or any other person or entity
            for any direct or indirect losses (including loss of profits,
            business or opportunities), damages, or costs arising from our
            decision to reject your application to open an Account(s).
          </li>
          <li>
            <strong>Identity Verification</strong>. As a money services business
            registered with the U.S. Department of the Treasury&rsquo;s
            Financial Crimes Enforcement Network, INTUITION EXCHANGE is required
            to, among other things, identify users on our Platform. You agree to
            provide us with the information we request for the purposes of
            identity verification and the detection of money laundering,
            terrorist financing, fraud, or any other financial crime and permit
            us to keep a record of such information for at least six years (see
            below for details). You will need to complete certain verification
            procedures before you are permitted to use the Services and your
            access to one or more Account(s) or the Services, and the Limits
            (defined below) that apply to your use of the Account(s) or the
            Services may be altered as a result of information collected on an
            ongoing basis. In addition, as part of our risk management and fraud
            prevention processes we may from time-to-time require you to
            reconfirm or update some of the information you entered when you
            took part in our identity verification procedure. The information we
            request may include certain personal information, including, but not
            limited to, your name, address, telephone number, email address,
            date of birth, taxpayer identification number, social security
            number or government identification number, scans of
            government-issued identity documents and when applicable bank
            account information (such as the name of the bank, the account type,
            routing number, and account number) and in some cases (where
            permitted by law), special categories of personal data, such as your
            biometric information. INTUITION EXCHANGE will request your consent
            before collecting any biometric information from you. In addition to
            providing this information, to facilitate compliance with global
            industry standards for data retention, you agree to permit us to
            keep a record of such information for the lifetime of your
            Account(s) plus six years beyond the termination of your Account(s).
            You agree to keep us updated if any of the information you provide
            changes. You authorize us to make inquiries, whether directly or
            through third parties, that we consider necessary to verify your
            identity or protect you and/or us against fraud, money laundering,
            terrorist financing, or other financial crime, and to take any
            action we deem necessary based on the results of such inquiries.
            When we carry out these inquiries, you acknowledge and agree that
            your personal information may be disclosed to identity verification,
            compliance data recordation, credit reference, fraud prevention, or
            financial crime agencies and that these agencies may respond to our
            inquiries in full. If there is reasonable doubt that any information
            provided by you is wrong, untruthful, outdated, or incomplete,
            INTUITION EXCHANGE shall have the right to send you a notice to
            request corrections, remove relevant information directly and, as
            the case may be, terminate all or part of the Services provided to
            you. INTUITION EXCHANGE shall also have the right, in its sole and
            absolute discretion, to terminate, suspend, or restrict your access
            to any Account(s) or Services should an issue arise with identity
            verification, including but not limited to circumstances in which
            INTUITION EXCHANGE has requested additional verification information
            from you but has not yet received or processed that information. You
            should also be aware that INTUITION EXCHANGE will also use other
            information about you that we become aware of, such as your
            geographic location, your IP address, your transaction data, and
            your user ISP/VPN address. We will store this information in our
            technical logs, again for six years beyond the termination of your
            account, and if we determine in our sole discretion that this
            information is required for our fraud, money laundering or to
            discharge any other legal obligation we have, we may have, we will
            make use of this information. In addition, again as part of our
            fraud prevention program or to discharge any other legal obligation
            INTUITION EXCHANGE may have, we may utilize your behavioral
            information as you use our services, e.g., how often you log in,
            what is the typical amount that you trade, etc . . . Under no
            circumstances shall any of the Indemnified Persons be responsible or
            liable for any direct or indirect losses (including loss of profits,
            business, or opportunities), damages, or costs suffered by you or
            any other person or entity due to any such termination, suspension,
            or restriction of access to any Account(s) or Services. Furthermore,
            you shall be solely and fully responsible for any loss or expenses
            incurred during the use of the Services if you cannot be reached
            through the contact information provided.
          </li>
          <li>
            <strong>Enhanced Due Diligence</strong>. We may require you to
            submit additional information about yourself or your business or
            institution, provide records or documentation, or have face-to-face
            meetings with representatives of INTUITION EXCHANGE (such
            process,&nbsp;<strong>&ldquo;Enhanced Due Diligence&rdquo;</strong>
            ). We reserve the right to charge you for any costs and fees
            INTUITION EXCHANGE incurs associated with such Enhanced Due
            Diligence. In its sole and absolute discretion, INTUITION EXCHANGE
            shall have the right to suspend or restrict your access to any
            Account(s) or Services pending submission of such Enhanced Due
            Diligence. Under no circumstances shall any of the Indemnified
            Persons be responsible or liable for any direct or indirect losses
            (including loss of profits, business, or opportunities), damages, or
            costs suffered by you or any other person or entity due to any such
            termination, suspension, or restriction of access to any Account(s)
            or Services.
          </li>
          <li>
            <strong>Access</strong>. To access your Account(s) or the Services,
            you must have the necessary equipment (such as a computer or
            smartphone) and the associated access to the Internet. Your
            Account(s) or the Services can be accessed directly using the
            Website or by such other mode of access (including but not limited
            to through the INTUITION EXCHANGE APIs) as INTUITION EXCHANGE may
            prescribe from time to time. The use of the Website and other
            methods may be subject to such additional terms as may be prescribed
            by INTUITION EXCHANGE. You are only permitted to access your
            Account(s) using your Account(s) login credentials and other
            required forms of authentication. We require multi-factor
            authentication to keep your Account(s) safe and secure. As a result,
            you may be required to use at least two forms of authentication when
            accessing your Account(s) and performing certain operations in your
            Account(s). Forms of multi-factor authentication in addition to your
            login credentials may include verification tokens delivered through
            SMS or a specified and supported 2FA application. If you choose to
            install and use two-factor authentication (<strong>&ldquo;</strong>
            <strong>2FA&rdquo;</strong>) on a device (e.g., phone or tablet) on
            which the operating system has been tampered with in any way, you do
            so at your own risk. This includes, but is not limited to, a
            &ldquo;rooted&rdquo; (Android) or &ldquo;jailbroken&rdquo; (iOS)
            device. We reserve the right in our sole discretion to prohibit
            access from or by any device on which the operating system has been
            or is suspected of having been modified or tampered with. You agree
            that we may provide your 2FA data to a third-party service provider
            in order to help us authenticate you. You must update to the most
            recent operating system(s) supported by INTUITION EXCHANGE or
            Related Parties on your necessary equipment (such as a computer or
            smartphone) as soon as such operating system(s) update becomes
            available. We reserve the right in our sole discretion to limit or
            suspend the Services offered to you if you attempt to access your
            Account(s)or the Services on an outdated or unsupported operating
            system(s). As further described under&nbsp;No Warranty, INTUITION
            EXCHANGE does not represent or warrant that your Account(s) or any
            Services will be available without interruption. This could result
            in the inability to buy, sell or withdraw assets for periods of time
            and may also lead to support response time delays. Under no
            circumstances shall any of the Indemnified Persons be responsible or
            liable for any direct or indirect losses (including loss of profits,
            business, or opportunities), damages, or costs suffered by you or
            any other person or entity due to an interruption in your access to
            your Account(s) or any Services.
          </li>
          <li>
            <strong>Personal Account Usage</strong>. You must ensure that
            Account(s) registered under your name will be used only for
            yourself, and not on behalf of any third party, unless you have
            obtained prior express written approval from INTUITION EXCHANGE. You
            must notify us immediately of any breach of security, loss, theft,
            or unauthorized use of your username, password, or security
            information. You must ensure that your home address is current and
            up to date at all times. In the event your home address changes, it
            is your responsibility to provide INTUITION EXCHANGE with your new
            home address. INTUITION EXCHANGE reserves the right to terminate,
            suspend, or restrict your access to any Account(s) or Services if
            there is reasonable suspicion, as determined in INTUITION
            EXCHANGE&rsquo;s sole and absolute discretion, that the person
            logged into your Account(s) is not you or if we suspect that the
            Account(s) have been or will be used for any illegal, fraudulent, or
            unauthorized purposes. Under no circumstances shall any of the
            Indemnified Persons be responsible or liable for any direct or
            indirect losses (including loss of profits, business, or
            opportunities), damages, or costs suffered by you or any other
            person or entity due to any such termination, suspension, or
            restriction of access to any Account(s) or Services.
          </li>
          <li>
            <strong>Corporate Account Usage</strong>. If you are a corporation,
            legal person, entity, or other organization for whom INTUITION
            EXCHANGE maintains a corporate account for the provision of services
            (<strong>&ldquo;Corporate Account&rdquo;</strong>), you must ensure
            that your Corporate Account(s) will not be used by persons that have
            not completed identity verification (See&nbsp;Identity
            Verification). You must notify us immediately of any breach of
            security, loss, theft, or unauthorized use of your username,
            password, or security information. INTUITION EXCHANGE reserves the
            right to terminate, suspend, or restrict your access to any
            Corporate Account(s) or Services if there is reasonable suspicion,
            as determined in INTUITION EXCHANGE&rsquo;s sole and absolute
            discretion, that the person logged into your Corporate Account(s) is
            not the natural person authorized to use the Corporate Account or if
            we suspect that the Corporate Account(s) have been or will be used
            for any illegal, fraudulent, or unauthorized purposes. Under no
            circumstances shall any of the Indemnified Persons be responsible or
            liable for any direct or indirect losses (including loss of profits,
            business or opportunities), damages, or costs suffered by you or any
            other person or entity due to any such termination, suspension, or
            restriction of access to any Corporate Account(s). At INTUITION
            EXCHANGE&rsquo;s discretion, you may access the segregated account
            nested under the primary Corporate Account (
            <strong>&ldquo;Sub-Account&rdquo;</strong>) feature on the Platform.
            Each natural person associated with a Sub-Account must undergo
            identity verification (See&nbsp;Identity Verification). Only one
            natural person may be associated with a particular Sub-Account. You
            must notify us immediately of any breach of security, loss, theft,
            or unauthorized use of your username, password, or security
            information. INTUITION EXCHANGE reserves the right to terminate,
            suspend, or restrict your access to any or all of the Services, if
            there is reasonable suspicion, as determined in INTUITION
            EXCHANGE&rsquo;s sole and absolute discretion, that more than one
            natural person has access to and/or transacts using the same
            Sub-Account, or if we suspect that Sub-Account(s) have been or will
            be used for any illegal, fraudulent, or unauthorized purposes. Under
            no circumstances shall any of the Indemnified Persons be responsible
            or liable for any direct or indirect losses (including loss of
            profits, business or opportunities), damages, or costs suffered by
            you or any other person or entity due to any such termination,
            suspension, or restriction of access to any Corporate Account(s).
          </li>
          <li>
            <strong>Safeguarding Your Account</strong>. At all times, you shall
            maintain adequate security and control of all of your Account(s)
            details, passwords, personal identification numbers, API keys, API
            secret keys, or any other codes that you use to access your
            Account(s) or the Services or to send any instruction, request, or
            order given to INTUITION EXCHANGE in relation to the operation of
            your Account(s)or to execute any Transaction (defined below),
            through such medium and in such form and manner as INTUITION
            EXCHANGE may require (<strong>&ldquo;</strong>
            <strong>Instruction&rdquo;</strong>) to us.
          </li>
          <li>
            <strong>Information</strong>. INTUITION EXCHANGE reserves the right
            to request, and you agree to provide, any and all information and
            documents INTUITION EXCHANGE deems relevant or necessary in
            connection with the use of the Platform and/or the Services.
            INTUITION EXCHANGE shall have the right, in its sole and absolute
            discretion, to suspend or restrict your access to any Account(s) or
            Services pending submission of such information and documents. All
            information processed by INTUITION EXCHANGE, its Related Parties, or
            other parties from which INTUITION EXCHANGE receives data management
            services may be transferred, processed, and stored anywhere in the
            world, including, but not limited to, the United States. Other
            countries&rsquo; data protection laws may differ from the laws where
            you live. INTUITION EXCHANGE endeavors to protect your information
            consistent with applicable law. Under no circumstances shall any of
            the Indemnified Persons be responsible or liable for any direct or
            indirect losses (including loss of profits, business, or
            opportunities), damages, or costs suffered by you or any other
            person or entity due to any such termination, suspension, or
            restriction of access to any Account(s) or Services.
          </li>
          <li>
            <strong>Account Closure</strong>. You may terminate your Account(s)
            at any time by following the account termination procedures as
            prescribed by INTUITION EXCHANGE from time to time. You will not be
            charged for terminating your Account(s), although you will be
            required to pay any outstanding amounts owed to us. You authorize us
            to cancel or suspend any pending transactions at the time of
            cancellation.
          </li>
          <li>
            <strong>Account Termination, Suspension, or Restriction</strong>. As
            detailed below, INTUITION EXCHANGE has the right to terminate,
            suspend, or restrict your access to your Account(s) or Services, as
            well as take any other action as we deem necessary, for the reasons
            detailed below.
          </li>
          <li>
            <strong>Death of Account Holder</strong>. You agree that in the
            event of your death, the representative(s) of your estate or the
            survivor or survivors shall give INTUITION EXCHANGE written notice
            thereof as soon as practicable. If INTUITION EXCHANGE receives legal
            documentation or has reason to believe you have died, INTUITION
            EXCHANGE will freeze your account. Your account will be frozen
            until: (1) a representative of your estate or authorized
            beneficiary, if located in a non-Restricted State and not otherwise
            prohibited from doing so, opens a INTUITION EXCHANGE Account or, if
            located in a Restricted State, provides wire transfer or ACH
            transfer instructions and provides sufficient legal documentation
            that they are entitled to receive the assets in your Account; or (2)
            you provide satisfactory notification to INTUITION EXCHANGE that you
            are not deceased. Beneficiaries receiving a wire transfer or ACH
            transfer will receive the liquidated value of the assets in the
            Account less any fees and costs associated with transfer. INTUITION
            EXCHANGE&rsquo;s ability to provide your representative(s) with the
            assets in your Account is subject to the restrictions imposed by
            law, regulation, court orders, technical capabilities, best
            practices, and these Terms. INTUITION EXCHANGE&rsquo;s ability to
            provide your representative(s) with the assets in your Account may
            also be impacted by the location of residence of the
            representative(s) and the ability of the representative to open a
            INTUITION EXCHANGE account to receive your Account assets. INTUITION
            EXCHANGE does not commit to any particular timeline for the transfer
            of your Account assets.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Transactions</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Transactions</strong>.&nbsp;Except to the extent described
            elsewhere in these Terms of Use, when you sell, purchase, or carry
            out other transactions in Digital Asset(s), other asset(s), or
            product(s) as INTUITION EXCHANGE may from time-to-time permit to be
            carried out on the Platform (<strong>&ldquo;</strong>
            <strong>Transactions&rdquo;</strong>), you are not Transacting with
            INTUITION EXCHANGE. Rather, INTUITION EXCHANGE acts as the agent,
            transacting on your behalf, to facilitate such Transaction between
            you and other users. You can purchase Digital Asset(s) using: (1)
            Digital Asset(s) or fiat currency in your INTUITION EXCHANGE
            Account(s) (through the use of the INTUITION EXCHANGE Fiat Wallet or
            third-party Linked Wallet, as applicable to your INTUITION EXCHANGE
            Account); (2) a valid bank account in the name that matches your
            Account(s); or (3) a credit or debit card in the name that matches
            your Account(s) (<strong>&ldquo;Payment Methods&rdquo;</strong>).
            Using a Payment Method to purchase Digital Asset(s) generally will
            initiate on the Business Day (defined below) that we receive your
            Instructions. Digital Asset(s) that you purchase will be deposited
            into your Account(s) as soon as the funds have settled to INTUITION
            EXCHANGE, which may take up to ten Business Days if the purchase was
            made via a bank account, credit, or debit card. As further described
            under&nbsp;No Warranty, INTUITION EXCHANGE does not represent or
            warrant that any Transaction will be completed successfully or
            within a specific time period. Under no circumstances shall any of
            the Indemnified Persons be responsible or liable for any direct or
            indirect losses (including loss of profits, business, or
            opportunities), damages, or costs suffered by you or any other
            person or entity due to the failure of a Transaction or the length
            of time needed to complete any Transaction.
          </li>
          <li>
            <strong>Trading Rules</strong>. You agree to adhere to, and be bound
            by, the&nbsp;Trading Rules. INTUITION EXCHANGE may, from time to
            time at its sole and absolute discretion, amend, supplement, or
            replace the Trading Rules, which shall be binding on you if you
            continue to maintain your Account(s) or use any of the Services
            after the effective date of any such amendment, supplement, or
            replacement of the Trading Rules.
          </li>
          <li>
            <strong>Market Makers and Related Party Transactions</strong>.
            INTUITION EXCHANGE appoints market makers, including Related Parties
            and market makers that are incorporated or otherwise operating
            outside of the United States, to promote liquidity and facilitate
            trading on the Platform and with respect to certain of INTUITION
            EXCHANGE&rsquo;s other trading products and services. INTUITION
            EXCHANGE&rsquo;s determinations concerning whether and how to
            onboard such market makers are made entirely at its sole and
            absolute discretion. You acknowledge and agree that certain
            services, including One Click Buy/Sell (&ldquo;OCBS&rdquo;),
            Convert, and over-the-counter (&ldquo;OTC&rdquo;) trading, are
            executed against or facilitated by INTUITION EXCHANGE, Related
            Parties, and/or other entities, and that it is anticipated that
            there are circumstances under which INTUITION EXCHANGE will transact
            on the platform for its own account. You further acknowledge, agree,
            and accept that (1) such market makers may enter into any
            Transaction with you as your counterparty; (2) such market makers
            may also maintain positions in various Digital Assets as part of
            their market making activities, including positions in Digital
            Assets that are contrary to your positions; and (3) under no
            circumstances shall any of the Indemnified Persons be responsible or
            liable for any direct or indirect losses (including loss of profits,
            business, or opportunities), damages, or costs suffered by you or
            any other person or entity as a result of the market making
            activities of the market makers.
          </li>
          <li>
            <strong>Limits</strong>. You may be subject to limits on the value
            of Transactions, or deposits into or withdrawals out of your
            Account(s) (together,&nbsp;<strong>&ldquo;</strong>
            <strong>Limits&rdquo;</strong>), stated in USD, that you may
            transact in a given period (e.g. daily). To view the Limits
            applicable to you, please refer to our&nbsp;Trading Rules&nbsp;page.
            We reserve the right to change any applicable Limits from time to
            time in our sole and absolute discretion. If you wish to increase
            the Limits applicable to you, you may submit a request to our user
            support team via our&nbsp;Support INTUITION EXCHANGE may, in its
            sole and absolute discretion, increase your Limit, lower your Limit,
            or maintain your current Limit, in each case subject to any further
            conditions that we deem necessary.
          </li>
          <li>
            <strong>Unauthorized Transactions</strong>. You are solely
            responsible for the control and use of your Account(s) and any
            Instruction sent from your Account(s) is deemed to be authorized and
            is binding on you. We are not obliged to verify the identity or
            authority of any person(s) using your Account(s) for the purpose of
            ensuring that you in fact have made or authorized the Instruction.
            We shall be at liberty to accept, and rely on, any Instruction sent
            from your Account(s). We are not obliged to verify the identity or
            authority of any person(s) using your Account(s) and we shall be at
            liberty to accept, and rely on, any Instruction sent from your
            Account(s). Notify us immediately if you notice unauthorized or
            suspicious activity in your Account(s). Under no circumstances shall
            any of the Indemnified Persons be responsible or liable for any
            direct or indirect losses (including loss of profits, business, or
            opportunities), damages, or costs suffered by you or any other
            person or entity, arising from or in connection with any of the
            Indemnified Persons&rsquo; reliance on any Instruction sent from
            your Account(s).
          </li>
          <li>
            <strong>Retention Of Transaction Information</strong>. To facilitate
            compliance with global industry standards for data retention, you
            agree to permit us (but agree to not require us) to keep a record of
            all Transaction information for the lifetime of your Account(s) plus
            six years beyond your Account(s) termination. Please review
            our&nbsp;Privacy Policy&nbsp;for more information on how we collect
            and use data relating to the use and performance of our Sites and
            Services.
          </li>
          <li>
            <strong>Third Party Applications</strong>. You may decide to grant
            access to your Account or Account credentials to a third party
            (including, without limitation, third party applications, bots, or
            browser extensions) (each, a&nbsp;
            <strong>&ldquo;Third-Party Application&rdquo;</strong>). By doing
            so, you are granting permission to a Third-Party Application to
            access or connect to your Account, and you expressly authorize
            INTUITION EXCHANGE to provide information to, or accept information,
            including Instructions, from, such Third-Party Application. You
            should carefully consider both the functionality purportedly offered
            by the Third-Party Application and the developer offering the
            functionality before authorizing the application to access your
            Account. Unless otherwise stated, we have no control over
            Third-Party Applications and assume no responsibility for
            developers&rsquo; If you authorize a Third-Party Application to
            connect to your Account and take actions on your behalf, you assume
            all risks associated with the use of that Third Party Application.
            If you have disputes with any Third-Party Application, you will need
            to address them directly with such Third-Party Application, or its
            developer. You acknowledge that we do not endorse or recommend any
            Third-Party Application for your use or that of any other user.
            Under no circumstances shall any of the Indemnified Persons be
            responsible or liable for any direct or indirect losses (including
            loss of profits, business, or opportunities), damages, or costs
            suffered by you or any other person or entity, arising out of or
            related to any act or omission of any Third-Party Application or
            related third party (including, without limitation, developers or
            other users of such Third-Party Application) using your Account
            credentials.
          </li>
          <li>
            <strong>Reversals &amp; Cancellations</strong>. You cannot cancel,
            reverse, or change any transaction marked as complete or pending. If
            your payment is not successful, if your payment method has
            insufficient funds, or if you reverse a payment made from funds in
            your bank account, you authorize INTUITION EXCHANGE, in its sole
            discretion, either to cancel the transaction or to debit your other
            payment methods in any amount necessary to complete the transaction.
            You are responsible for maintaining an adequate balance in order to
            avoid overdraft, non-sufficient funds (&ldquo;NSF&rdquo;), or
            similar fees charged by your payment provider. We reserve the right
            to refuse to process, or to cancel or reverse, any Transaction or
            Transfers in our sole discretion, even after funds have been debited
            from your account(s), if we suspect the transaction involves (or has
            a high risk of involvement in) money laundering, terrorist
            financing, fraud, or any other type of financial crime; in response
            to a subpoena, court order, or other government order; if we
            reasonably suspect that the transaction is erroneous; or if
            INTUITION EXCHANGE suspects the transaction relates to a Prohibited
            Use or a Prohibited Business as set forth below. In such instances,
            INTUITION EXCHANGE will reverse the transaction and we are under no
            obligation to allow you to reinstate a purchase or sale order at the
            same price or on the same terms as the canceled transaction.
          </li>
          <li>
            <strong>Erroneous Deposits</strong>. Should you receive assets into
            your Account(s) that were deposited in error by INTUITION EXCHANGE
            or any third party (including but not limited to another customer of
            INTUITION EXCHANGE), you hereby authorize INTUITION EXCHANGE, in its
            sole discretion, to withdraw these assets from your Account(s). If
            you receive erroneous deposits into your Account(s) and withdraw
            those assets before INTUITION EXCHANGE does so, INTUITION EXCHANGE
            reserves the right to demand the return of these assets, and should
            you refuse to do so, to liquidate assets in your Account(s) without
            notice. Under no circumstances shall any of the Indemnified Persons
            be responsible or liable for any direct or indirect losses
            (including loss of profits, business or opportunities), damages, or
            costs suffered by you or any other person or entity, due to any of
            the Indemnified Persons&rsquo; action or inaction taken as a result
            of an erroneous deposit of assets into your Account(s).
          </li>
          <li>
            <strong>Transfers of Unsupported Assets</strong>. You cannot deposit
            digital assets in your Account(s) unless those digital assets are
            supported on the INTUITION EXCHANGE platform. A list of digital
            assets supported by INTUITION EXCHANGE&rsquo;s platform is published
            on&nbsp;its site. Should you attempt to deposit unsupported digital
            assets in your Account(s), INTUITION EXCHANGE has no responsibility
            to recover these assets or to attempt to do so. Under no
            circumstances shall any of the Indemnified Persons be responsible or
            liable for any direct or indirect losses (including loss of profits,
            business or opportunities), damages, or costs suffered by you or any
            other person or entity, due to any of the Indemnified Persons&rsquo;
            action or inaction taken as a result of your attempt to deposit
            unsupported assets into your Account(s).
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Trading Risks</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Forks</strong>. It is possible that planned, unplanned,
            sudden, scheduled, expected, unexpected, publicized, not well-known,
            consensual, and/or controversial changes to the underlying operating
            rules of certain Digital Assets may occur from time to time in such
            a way as to result in the creation of one or more related versions
            of an existing Digital Asset (each instance of any such change,
            a&nbsp;<strong>&ldquo;Fork&rdquo;</strong>). Forks may result in
            multiple versions of a Digital Asset and could lead to the dominance
            of one or more such versions of a Digital Asset (each a&nbsp;
            <strong>&ldquo;Dominant Digital Asset&rdquo;</strong>) and the
            partial or total abandonment or loss of value of any other versions
            of such Digital Asset (each a&nbsp;
            <strong>&ldquo;Non-Dominant Digital Asset&rdquo;</strong>). We are
            under no obligation to support a Fork of a Digital Asset that you
            hold in your Account(s), whether or not any resulting version of
            such Forked Digital Asset is a Dominant Digital Asset or a
            Non-Dominant Digital Asset. If we elect, at our sole and absolute
            discretion, to support a Fork of a Digital Asset, we will make a
            public announcement through the Website. Under no circumstances
            shall any of the Indemnified Persons (defined below) be responsible
            or liable for any direct or indirect losses (including loss of
            profits, business, or opportunities), damages or costs suffered by
            you or any other person or entity, arising from or in connection
            with any of the Indemnified Persons&rsquo; (1) decision to support
            such Fork or the timing of implementation of such support, or (2)
            decision to not support a Fork of any given Digital Asset, including
            the determination to support, continue to support, or cease to
            support any Dominant Digital Asset or Non-Dominant Digital Asset.
          </li>
          <li>
            <strong>Airdrops</strong>. We shall have sole and absolute
            discretion to decide whether or not to support any distributions,
            dividends, or&nbsp;<strong>&ldquo;airdrops&rdquo;</strong>of Digital
            Assets to Account(s) operated by us (collectively,
            &ldquo;Airdrops&rdquo;), regardless of whether or not you would have
            received such Airdrops if you held your Digital Assets outside of
            the Account(s) operated by us. We have no obligation to distribute
            and/or support any Airdrop and shall bear no liability to you or any
            other persons for failing to do so.
          </li>
          <li>
            <strong>Disclosure</strong>. YOU ACKNOWLEDGE AND ACCEPT THE
            FOLLOWING RISKS, IN ADDITION TO RISKS PUBLISHED BY INTUITION
            EXCHANGE THROUGH ONE OR MORE RISK DISCLOSURES ON ITS WEBSITE,
            RELATING TO THE USE OF THE PLATFORM AND THE SERVICES:
            <ul>
              <li>
                the risk of loss in trading Digital Assets may be substantial
                and losses may occur over a short period of time;
              </li>
              <li>
                the price and liquidity of Digital Assets has been subject to
                large fluctuations in the past and may be subject to large
                fluctuations in the future;
              </li>
              <li>
                Digital Assets are not legal tender, are not backed by any
                government, and accounts and value balances are not subject to
                protections or insurance provided by the Federal Deposit
                Insurance Corporation or the Securities Investor Protection
                Corporation;
              </li>
              <li>
                in your jurisdiction, INTUITION EXCHANGE may not be regulated as
                a financial institution;
              </li>
              <li>
                executive orders, judicial interpretations of statutes and
                regulations, legislative and regulatory changes or actions at
                the state, federal, territorial, or international level may
                adversely affect the use, transfer, exchange, taxing, and value
                of Digital Assets;
              </li>
              <li>
                Digital Asset blockchains may Fork, and we may not support the
                Forked Digital Asset promptly or at all;
              </li>
              <li>
                Transactions (defined below) in Digital Assets may be
                irreversible, and accordingly, losses due to fraudulent or
                accidental Transactions may not be recoverable;
              </li>
              <li>
                some transactions in Digital Assets shall be deemed to be made
                when recorded on a public ledger, which is not necessarily the
                date or time that you or any other user initiates or completes
                the Transactions on the Platform;
              </li>
              <li>
                the value of Digital Assets may be derived from or influenced by
                the continued willingness of market participants to exchange
                fiat currencies for Digital Assets, which may result in the
                potential for permanent and total loss of value of a particular
                Digital Asset should the market for that Digital Asset
                disappear;
              </li>
              <li>
                the nature of Digital Assets may lead to an increased risk of
                fraud or cyberattack;
              </li>
              <li>
                the nature of Digital Assets means that technological
                difficulties experienced by INTUITION EXCHANGE may prevent
                access to, or use of, your Digital Assets;
              </li>
              <li>
                the volatility and unpredictability of the price of Digital
                Assets relative to fiat currency may result in significant loss
                over a short period of time;
              </li>
              <li>
                there is no assurance that a person who accepts a Digital Asset
                as payment today will continue to do so in the future;
              </li>
              <li>
                any bond or trust account maintained by INTUITION EXCHANGE for
                the benefit of its customers may not be sufficient to cover all
                losses incurred by customers;
              </li>
              <li>
                INTUITION EXCHANGE may experience sophisticated cyberattacks,
                unexpected surges in activity, or other operational or technical
                difficulties that may cause interruptions in the Services;
              </li>
              <li>
                INTUITION EXCHANGE having Digital Assets on deposit or with any
                third-party, including Related Parties, in a custodial
                relationship has attendant risks, which include security
                breaches, risk of contractual breach, and risk of loss; and
              </li>
              <li>
                Digital Assets blockchains may become congested or become
                nonoperational because of attacks, bugs, hard forks, or other
                unforeseeable reasons.
              </li>
            </ul>
          </li>
        </ul>
        <Typography.Paragraph>
          INTUITION EXCHANGE does not provide any financial, investment,
          business, accounting, tax, legal, or other advice to you. INTUITION
          EXCHANGE is not holding any fiat monies and/or Digital Assets as your
          trustee, and is not acting as your broker, futures commission
          merchant, intermediary, agent, trustee, advisor or in any fiduciary
          capacity. All Transactions are executed automatically, based on your
          Instructions (defined below), and you are solely responsible for
          determining whether any investment, investment strategy, or
          Transaction is appropriate for you based on your personal investment
          objectives, financial circumstances, and risk tolerance.
          <br /> While INTUITION EXCHANGE has implemented policies and
          procedures designed to effect compliance with relevant laws and
          regulations, there can be no assurance that INTUITION EXCHANGE and its
          employees will not fail to comply with new laws and regulations or
          with interpretations of existing laws and regulations, or that its
          policies and procedures for listing digital assets on its platform
          will always be in line with such laws and regulations.
        </Typography.Paragraph>
        <ul>
          <li>
            <strong>Digital Asset Delisting</strong>. From time to time and in
            our sole and absolute discretion, we may remove one or more Digital
            Assets from the Platform such that you will no longer be able to
            access such Digital Assets as part of the Trading Services and will
            be no longer able to maintain balances in such Digital Assets or
            make any deposits or withdrawal thereof, in each case with immediate
            effect for any reason or no reason whatsoever, including, without
            limitation, where we are required to do so by any applicable law or
            regulation (including, without limitation, any U.S. federal or state
            securities laws), or any court or authority to which we are subject
            in any jurisdictions. You hereby acknowledge and consent to that our
            ability to take such delisting actions, including, without
            limitations, to cancel your outstanding Instructions for delisted
            Digital Assets and require you to remove delisted Digital Assets
            within a reasonable period of time, beyond which you will no longer
            be able to access the delisted Digital Assets. Under no
            circumstances shall any of the Indemnified Persons be responsible or
            liable for any direct or indirect losses (including loss of profits,
            business, or opportunities), damages or costs suffered by you or any
            other person or entity, due to any of the Indemnified Persons&rsquo;
            action or inaction in accordance with these Terms.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Instructions</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Your Instructions</strong>. You are solely responsible for
            accurately entering any Instruction. INTUITION EXCHANGE is not
            obliged to verify the accuracy or completeness of any such
            information or Instruction, for monitoring, or refusing to process
            duplicate Instructions. Your Instructions are irrevocable,
            unconditional, and are binding on you, and such Instructions may be
            acted or relied upon by us irrespective of any other circumstances.
            As such, once you give any Instruction, you have no right to rescind
            or withdraw such Instruction without our written consent. Your
            Instruction shall not be considered to be received by INTUITION
            EXCHANGE until it has been received by INTUITION EXCHANGE&rsquo;s
            server. Additionally, INTUITION EXCHANGE&rsquo;s records of all
            Instructions shall be conclusive and binding on you for all
            purposes.
          </li>
          <li>
            <strong>Your Identity Or Authority</strong>. INTUITION EXCHANGE has
            no obligation to verify the identity or authority of any person
            giving any Instruction and the authenticity of such Instruction.
            Under no circumstances shall any of the Indemnified Persons be
            responsible or liable for any direct or indirect losses (including
            loss of profits, business or opportunities), damages, or costs
            suffered by you or any other person or entity, arising from any of
            the Indemnified Persons relying or acting upon any Instruction which
            is given or purported to be given by you, regardless of the
            circumstances prevailing at the time of such Instruction, the nature
            of the arrangement, services, or transaction made pursuant to such
            Instruction or the amount of money involved and notwithstanding any
            error, misunderstanding, fraud, forgery, lack of clarity, or
            authorization in the terms of such Instruction.
          </li>
          <li>
            <strong>Our Discretion</strong>. You acknowledge and agree that
            INTUITION EXCHANGE may, in its sole and absolute discretion, refuse
            to act upon or defer acting upon any Instruction, or seek further
            information with respect to the Instruction. Under no circumstances
            shall any of the Indemnified Persons be responsible or liable for
            any direct or indirect losses (including loss of profits, business,
            or opportunities), damages, or costs suffered by you or any other
            person or entity, arising from or in connection with any of the
            Indemnified Persons&rsquo; refusal or delay in acting upon any
            Instruction.
          </li>
          <li>
            <strong>Notification Of Instructions</strong>. INTUITION EXCHANGE
            may transmit, via electronic communication, a notification to you
            upon receipt of any deposit or withdrawal Instruction from you, or
            upon completion of such Instruction. All notifications are deemed
            received by you immediately upon such notification&rsquo;s
            transmission. You must ensure that the details in any such
            notification are in accordance with your Instruction. You must
            contact us if you do not receive completion notifications.
          </li>
          <li>
            <strong>Credit/Debit Authorization</strong>. You authorize INTUITION
            EXCHANGE to credit or debit (or provide settlement information to
            third parties for the purposes of the third-party crediting or
            debiting) your Digital Assets and/or fiat monies from your
            Account(s) in accordance with your Instruction. We reserve the right
            not to effect any Transaction if you have insufficient fiat monies
            or Digital Assets in your Account(s) (i.e. less than the required
            amount to settle the Transaction and to pay all the fees associated
            with the Transaction).
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Communications; E-Sign Disclosure and Consent</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Account Communication</strong>. You agree and understand
            that all communication with you (collectively,
            &ldquo;Communications&rdquo;) will be via email or another
            electronic method that INTUITION EXCHANGE may prescribe from time to
            time. We will use the email address on record for your Account(s) as
            our primary means of communicating with you. Communications include
            (i) these Terms; (ii) any policies published by INTUITION EXCHANGE
            with respect to use of the Services; (iii) account details, history,
            transaction receipts, confirmations, and any other Account or
            Transaction information; (iv) legal, regulatory, and tax disclosures
            or statements we may be required to make available to you; and (v)
            responses to claims or customer support inquiries filed in
            connection with your Account.
            <br /> We will provide these Communications to you by posting these
            Terms and any policies published by INTUITION EXCHANGE regarding
            INTUITION EXCHANGE&rsquo;s Services on the Website, and INTUITION
            EXCHANGE may also email these Communications to you at the primary
            email address listed on your Account profile, communicating with you
            via Chat (discussed further below) and/or through other electronic
            communication such as text message or mobile push notification.
            <br /> To ensure that you receive all of our Communications, you
            agree to keep your email address up-to-date and immediately notify
            us if there are any changes. Delivery of any Communication to the
            email address on record shall be considered valid and binding for
            all purposes. If any email communication is returned as
            undeliverable, we retain the right to block your Account(s) and
            access to the Services until you provide and confirm a new and valid
            email address.
          </li>
          <li>
            <strong>Hardware and Software Requirements</strong>. In order to
            access and retain electronic Communications, you will need the
            following computer hardware and software. You represent and warrant
            that you have all of the following:
            <ul>
              <li>A device with an Internet connection;</li>
              <li>
                A current web browser that includes 128-bit encryption (e.g.
                Internet Explorer version 9.0 and above, Firefox version 3.6 and
                above, Chrome version 31.0 and above, or Safari 7.0 and above)
                with cookies enabled;
              </li>
              <li>
                A valid email address (your primary email address on file with
                INTUITION EXCHANGE); and
              </li>
              <li>
                Sufficient storage space to save past Communications or an
                installed printer to print them.
              </li>
            </ul>
          </li>
        </ul>
        <Typography.Paragraph>
          We reserve the right to require you to update your Internet browser
          for security purposes.
        </Typography.Paragraph>
        <ul>
          <li>
            <strong>How to Withdraw Your Consent</strong>. You may withdraw your
            consent to receive Communications electronically by contacting us
            at&nbsp;https://support.Intuition Exchange/hc/en-us/requests/new. If
            you fail to provide or if you withdraw your consent to receive
            Communications electronically, INTUITION EXCHANGE reserves the right
            to immediately close your account or charge you additional fees for
            paper copies.
          </li>
          <li>
            <strong>Updating Your Information</strong>. It is your
            responsibility to provide us with a true, accurate and complete
            email address and your contact information, and to keep such
            information up to date. You understand and agree that if INTUITION
            EXCHANGE sends you an electronic Communication but you do not
            receive it because your primary email address on file is incorrect,
            out of date, or blocked or sent to spam by your service provider, or
            you are otherwise unable to receive electronic Communications,
            INTUITION EXCHANGE will be deemed to have provided the Communication
            to you. You may update your information by submitting a ticket to us
            at:&nbsp;https://support.Intuition Exchange/hc/en-us/requests/new.
          </li>
          <li>
            <strong>Account History</strong>. Information on your past
            Transaction(s) (<strong>&ldquo;Transaction History&rdquo;</strong>)
            will be made available on the Platform. Your Transaction History
            contains all of your trading activity on the Platform. We will use
            commercially reasonable efforts to ensure that the information
            contained in the notices we send you on your Transaction History is
            reasonably accurate and reliable.
          </li>
          <li>
            <strong>Account Review And Acknowledgment</strong>. It is your sole
            responsibility to review your Transaction History and any notices or
            Communications sent by us. If for any reason you are unable to do
            so, or you do not receive our notices or Communications, it is your
            responsibility to notify us immediately.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Termination, Suspension, or Restriction</strong>
        </Typography.Title>
        <Typography.Paragraph>
          In our sole and absolute discretion, we may: (1) refuse to complete,
          block, cancel, or reverse any Transaction you have authorized or
          instructed; (2) terminate, suspend, or restrict your access to any or
          all of the Services; (3) terminate, suspend, or restrict your access
          to any or all of your Account(s); and/or (4) refuse to transmit
          information or Instructions to third parties (including but not
          limited to third-party wallet operators), in each case with immediate
          effect for any reason or no reason whatsoever, including, without
          limitation, where:
        </Typography.Paragraph>
        <ul>
          <li>
            we are required to do so by applicable law or regulation, or any
            court or legal authority to which we are subject in any
            jurisdiction;
          </li>
          <li>
            we have determined you are not, or are no longer, eligible to use
            the Services;
          </li>
          <li>
            we have determined or suspect that you have breached these Terms
            (including any other documents, materials or information
            incorporated by reference herein) or the Trading Rules;
          </li>
          <li>
            we have determined or suspect that any Transaction is unauthorized,
            erroneous, fraudulent, or unlawful or we have determined or suspect
            that your Account(s) or the Services are being used in a fraudulent,
            unauthorized, or unlawful manner;
          </li>
          <li>
            we have determined or suspect there is any occurrence of money
            laundering, terrorist financing, fraud, or any other crime;
          </li>
          <li>
            use of your Account(s) is subject to any pending or ongoing
            litigation, investigation, or judicial, governmental or regulatory
            proceedings and/or we perceive a heightened risk of legal or
            regulatory non-compliance associated with your Account(s) activity;
          </li>
          <li>
            you owe amounts to INTUITION EXCHANGE that are not satisfied,
            whether due to a returned deposit, chargeback, or any other basis;
          </li>
          <li>
            an issue has arisen with the verification of your identity; and
          </li>
          <li>
            you have taken any action that may circumvent our controls, such as
            opening multiple Accounts without our written consent or abusing
            promotions which we may offer from time to time.
          </li>
        </ul>
        <Typography.Paragraph>
          <br /> In the event your Account is terminated, suspended or otherwise
          restricted INTUITION EXCHANGE reserves the right to take any action it
          deems necessary to remediate the issue in a timely manner or as
          otherwise may be required under applicable law.
          <br />
          <br /> In the event an asset has a current market value of less than
          the&nbsp;Minimum Order Size, INTUITION EXCHANGE reserves the right to
          transfer any asset to US dollar equivalent at the market spot price.
          In the event that your account is terminated, INTUITION
          EXCHANGE&rsquo;s ability to provide you with the assets in your
          account is subject to the restrictions imposed by law, regulation,
          court orders, technical capabilities, best practices, and these Terms.
          INTUITION EXCHANGE does not commit to any timeline or method for the
          transfer of such assets.
          <br />
          <br /> Under no circumstances shall any of the Indemnified Persons be
          responsible or liable for any direct or indirect losses (including
          loss of profits, business, or opportunities), damages, or costs
          suffered by you or any other person or entity due to any such
          termination, suspension, or restriction of access to any Account(s),
          or any other action taken by any of the Indemnified Persons in
          connection with your ineligibility to use the Services.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>Prohibited Use</strong>
        </Typography.Title>
        <Typography.Paragraph>
          You may not use your INTUITION EXCHANGE Account to engage in the
          following categories of activity (&quot;Prohibited Use&quot;). The
          specific types of use listed below are representative, but not
          exhaustive. If you are uncertain as to whether or not your use of
          INTUITION EXCHANGE Services or the INTUITION EXCHANGE Platform
          involves a Prohibited Use or have questions about how these
          requirements apply to you, please submit a support request
          at:&nbsp;https://support.Intuition Exchange
          <br />
          <br /> By opening a INTUITION EXCHANGE Account, you represent and
          warrant that you will not use your INTUITION EXCHANGE Account, any
          INTUITION EXCHANGE Services and/or the INTUITION EXCHANGE Platform to
          do any of the following:
        </Typography.Paragraph>
        <ul>
          <li>
            <strong>Unlawful Activity</strong>: Activity which would violate, or
            cause a violation of, economic or financial sanctions, trade
            embargoes, and restrictions imposed, administered or enforced from
            time to time by governmental authorities, including, without
            limitation, the U.S. Department of the Treasury&rsquo;s Office of
            Foreign Assets Control, the U.S. Department of State, the U.S.
            Department of Commerce, and any other governmental authorities with
            jurisdiction over you or INTUITION EXCHANGE (collectively,&nbsp;
            <strong>&ldquo;</strong>
            <strong>Sanctions&rdquo;</strong>); and activity which would
            violate, or assist in violation of, laws, statutes, ordinances, or
            regulations regarding the publishing, distribution or dissemination
            of any unlawful material or information.
          </li>
          <li>
            <strong>Abusive Activity</strong>: Actions which impose an
            unreasonable or disproportionately large load on our infrastructure,
            or detrimentally interfere with, intercept, or expropriate any
            system, data, or information; transmit or upload any material to the
            Website that contains viruses, trojan horses, worms, or any other
            harmful or deleterious programs; attempt to gain unauthorized access
            to the Website, other INTUITION EXCHANGE Accounts, computer systems
            or networks connected to the Website, through password mining or any
            other means; use INTUITION EXCHANGE Account information of another
            party to access or use the Website, except in the case of specific
            merchants and/or applications which are specifically authorized by a
            user to access such user&apos;s INTUITION EXCHANGE Account and
            information; or transfer your account access or rights to your
            account to a third party, unless by operation of law or with the
            express written permission of INTUITION EXCHANGE.
          </li>
          <li>
            <strong>Abuse Other Users</strong>: Interfere with another
            individual&apos;s or entity&apos;s access to or use of any INTUITION
            EXCHANGE Services; defame, abuse, extort, harass, stalk, threaten or
            otherwise violate or infringe the legal rights (such as, but not
            limited to, rights of privacy, publicity and intellectual property)
            of others; harvest or otherwise collect information from the Website
            about others, including without limitation email addresses, without
            proper consent.
          </li>
          <li>
            <strong>Fraud</strong>: Activity which operates to defraud INTUITION
            EXCHANGE, INTUITION EXCHANGE users, or any other person; provide any
            false, inaccurate, or misleading information to INTUITION EXCHANGE.
          </li>
          <li>
            <strong>Gambling</strong>: Lotteries; bidding fee auctions; sports
            forecasting or odds making; fantasy sports leagues with cash prizes;
            internet gaming; contests; sweepstakes; games of chance.
          </li>
          <li>
            <strong>Intellectual Property Infringement</strong>: Engage in
            transactions involving items that infringe or violate any copyright,
            trademark, right of publicity or privacy or any other proprietary
            right under the law, including but not limited to sales,
            distribution, or access to counterfeit music, movies, software, or
            other licensed materials without the appropriate authorization from
            the rights holder; use of INTUITION EXCHANGE intellectual property,
            name, or logo, including use of INTUITION EXCHANGE trade or service
            marks, without express consent from INTUITION EXCHANGE or in a
            manner that otherwise harms INTUITION EXCHANGE or the INTUITION
            EXCHANGE or Binance brands; any action that implies an untrue
            endorsement by or affiliation with INTUITION EXCHANGE.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Prohibited Businesses</strong>
        </Typography.Title>
        <Typography.Paragraph>
          In addition to the Prohibited Uses described above, the following
          categories of businesses, business practices, and sale items are
          barred from being carried out using INTUITION EXCHANGE Services or the
          INTUITION EXCHANGE Platform (&quot;Prohibited Businesses&quot;). Most
          Prohibited Businesses categories are imposed by card network rules or
          the requirements of our banking providers or processors. The specific
          types of businesses listed below are representative, but not
          exhaustive. If you are uncertain as to whether or not your use of
          INTUITION EXCHANGE Services or the INTUITION EXCHANGE Platform
          involves a Prohibited Business, or have questions about how these
          requirements apply to you, please contact us
          at:&nbsp;https://support.Intuition Exchange/
          <br />
          <br /> By opening a INTUITION EXCHANGE Account, you represent and
          warrant that you will not use INTUITION EXCHANGE Services or the
          INTUITION EXCHANGE Platform in connection with any of the following
          businesses, activities, practices, or items:
        </Typography.Paragraph>
        <ul>
          <li>
            Investment and Credit Services: securities brokers; mortgage
            consulting or debt reduction services; credit counseling or repair;
            real estate opportunities; investment schemes;
          </li>
          <li>
            Restricted Financial Services: check cashing, bail bonds;
            collections agencies;
          </li>
          <li>
            Intellectual Property or Proprietary Rights Infringement: sales,
            distribution, or access to counterfeit music, movies, software, or
            other licensed materials without the appropriate authorization from
            the rights holder;
          </li>
          <li>
            Counterfeit or Unauthorized Goods: unauthorized sale or resale of
            brand name or designer products or services; sale of goods or
            services that are illegally imported or exported or which are
            stolen;
          </li>
          <li>
            Regulated Products and Services: marijuana dispensaries and related
            businesses; sale of tobacco, e-cigarettes, and e-liquid; online
            prescription or pharmaceutical services; age restricted goods or
            services; weapons and munitions; gunpowder and other explosives;
            fireworks and related goods; toxic, flammable, and radioactive
            materials;
          </li>
          <li>
            Drugs and Drug Paraphernalia: sale of narcotics, controlled
            substances, and any equipment designed for making or using drugs,
            such as bongs, vaporizers, and hookahs;
          </li>
          <li>
            Pseudo-Pharmaceuticals: pharmaceuticals and other products that make
            health claims that have not been approved or verified by the
            applicable local and/or national regulatory body;
          </li>
          <li>
            Substances designed to mimic illegal drugs: sale of a legal
            substance that provides the same effect as an illegal drug (e.g.
            salvia, kratom);
          </li>
          <li>
            Adult Content and Services: pornography and other obscene materials
            (including literature, imagery and other media); sites offering any
            sexually-related services such as prostitution, escorts, pay-per
            view, adult live chat features;
          </li>
          <li>
            Multi-level Marketing: pyramid schemes, network marketing, and
            referral marketing programs;
          </li>
          <li>
            Unfair, predatory or deceptive practices: investment opportunities
            or other services that promise high rewards; sale or resale of a
            service without added benefit to the buyer; resale of government
            offerings without authorization or added value; sites that we
            determine in our sole discretion to be unfair, deceptive, or
            predatory towards consumers; and
          </li>
          <li>
            High-risk businesses: any businesses that we believe poses elevated
            financial risk, legal liability, or violates card network or bank
            policies.
          </li>
        </ul>
        <Typography.Paragraph>
          <br /> You acknowledge and agree that INTUITION EXCHANGE&rsquo;s
          decision to take certain actions, including, without limitations, to
          terminate, suspend, or restrict your access to your Account(s) or the
          Services, may be based on confidential criteria that are essential to
          our risk management and security protocols. You agree that we are
          under no obligation to disclose the details of our risk management and
          security procedures to you. You are liable to INTUITION EXCHANGE for
          any damages, costs, and fees incurred by INTUITION EXCHANGE as a
          result of your breach of the foregoing representations and warranties.
          Under no circumstances shall any of the Indemnified Persons be
          responsible or liable for any direct or indirect losses (including
          loss of profits, business or opportunities), damages, or costs
          suffered by you or any other person or entity, due to any of the
          Indemnified Persons&rsquo; action or inaction taken as a result of
          your breach of any of the foregoing representations and warranties.
          <br />
          <br />
          <strong>
            Notice to All Customers Regarding the Unlawful Internet Gambling
            Enforcement Act of 2006 (Regulation GG)
          </strong>
          <br />
          <br /> The Unlawful Internet Gambling Act (<strong>&ldquo;</strong>
          <strong>UIGEA&rdquo;</strong>) of 2006 prohibits Intuition Exchange
          from processing restricted transactions. Restricted transactions are
          transactions in which a person accepts credit, funds, instruments or
          other proceeds from another person in connection with unlawful
          internet gambling.
          <br />
          <br /> The UIGEA, signed into law in 2006, prohibits any person
          engaged in the business of betting or wagering (as defined in the Act)
          from knowingly accepting payments in connection with the participation
          of another person in unlawful internet gambling. The United States
          Department of Treasury and the Federal Reserve Board have issued a
          joint final rule, Regulation GG, to implement this Act.
          <br />
          <br /> As defined in Regulation GG, unlawful internet gambling means
          to &ldquo;place, receive or otherwise knowingly transmit a bet or
          wager is unlawful under any applicable Federal or State law in the
          State or Tribal lands in which the bet or wager is initiated, received
          or otherwise made.&rdquo;
          <br />
          <br />
          <strong>ACH Returns and Chargebacks</strong>. In using your
          Account(s), should you initiate an ACH transaction using fiat currency
          from a personal bank account, whether to acquire digital assets or for
          any other reason, you are responsible for ensuring that INTUITION
          EXCHANGE is reimbursed for any amounts credited to your Account(s).
          Incurring a returned ACH transaction or chargeback is a violation of
          these Terms, and upon such occurrence you are solely responsible for
          reimbursing INTUITION EXCHANGE for the full amount of the ACH return
          or chargeback. Any ACH return or chargeback resulting from the use of
          your Account(s) or Services may result in an immediate suspension
          and/or restriction of your Accounts(s) and Services. To reactivate
          suspended and/or restricted Account(s) and Services, you must
          reimburse INTUITION EXCHANGE for the full value of the ACH or
          chargeback. You are liable for any credited amounts in such event, and
          you authorize and grant INTUITION EXCHANGE the right to deduct all
          such amounts, as well as any costs and fees incurred as a result of
          the ACH return or chargeback, directly from any assets in your
          Account(s) without notice. Should the assets in your Account(s) be
          insufficient to reimburse INTUITION EXCHANGE for the full amount of
          the ACH return or chargeback, you are responsible for reimbursing
          INTUITION EXCHANGE any balance. Should you refuse to do so, your
          Account(s) will be terminated and INTUITION EXCHANGE can and will
          pursue recovery of the balance through legal means and consistent with
          these Terms. Under no circumstances shall any of the Indemnified
          Persons be responsible or liable for any direct or indirect losses
          (including loss of profits, business or opportunities), damages, or
          costs suffered by you or any other person or entity, due to any of the
          Indemnified Persons&rsquo; action or inaction taken as a result of an
          ACH return or chargeback.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>Representations And Warranties</strong>
        </Typography.Title>
        <Typography.Paragraph>
          You hereby represent and warrant to INTUITION EXCHANGE, at all times,
          the following:
        </Typography.Paragraph>
        <ul>
          <li>
            <strong>Accuracy</strong>. All documents and information you provide
            to INTUITION EXCHANGE are true, accurate, complete, and up-to-date
            in all respects, and may be relied upon by us in determining whether
            or not you are eligible to access the Platform or to utilize the
            Services.
          </li>
          <li>
            <strong>Authority</strong>. You have full power, authority, and
            capacity to (1) access and use the Platform and/or the Services; and
            (2) enter into and deliver, and perform your obligations under,
            these Terms and any agreement entered into pursuant to, or in
            connection with, these Terms.
          </li>
          <li>
            <strong>Authorization</strong>. All consents, permissions,
            authorizations, approvals and agreements of third parties and all
            authorizations, approvals, permissions, consents, registrations,
            declarations, filings with any regulatory authority, governmental
            department, commission, agency or other organization having
            jurisdiction over you which are necessary or desirable for you to
            obtain in order to (1) access and use the Platform and/or the
            Services and (2) enter into and deliver, and perform the
            transactions contemplated under these Terms and any agreement
            entered into pursuant to, or in connection with, these Terms, have
            been unconditionally obtained in writing, disclosed to us in
            writing, and have not been withdrawn or amended.
          </li>
          <li>
            <strong>Binding Contract</strong>. These Terms and any agreement
            entered into pursuant to, or in connection with, these Terms
            constitute valid and legally binding obligations, enforceable
            against you in accordance with their respective terms.
          </li>
          <li>
            <strong>Incorporation</strong>. If you are an entity, you are duly
            incorporated, duly organized, and validly existing under the laws of
            your jurisdiction and have full power to conduct your business. If
            you are an individual, you are not less than 18 years old.
          </li>
          <li>
            <strong>No Breach</strong>. Your access and use of the Platform
            and/or the Services, your execution and delivery of, and the
            performance of your obligations under these Terms and any agreement
            entered into pursuant to, or in connection with, these Terms, will
            not:
            <ul>
              <li>
                if you are an entity, result in a breach of or conflict with any
                provision of your constitution (or equivalent constitutive
                documents);
              </li>
              <li>
                result in a breach of, or constitute a default under, any
                instrument, agreement, document or undertaking to which you are
                a party or by which you or any of your property is bound or
                subject; and
              </li>
              <li>
                result in a breach of any applicable laws, rules or regulations
                or of any order, decree or judgment of any court, any award of
                any arbitrator or those of any governmental or regulatory
                authority in any jurisdiction.
              </li>
            </ul>
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Covenants</strong>
        </Typography.Title>
        <Typography.Paragraph>
          You covenant and agree that you shall not:
        </Typography.Paragraph>
        <ul>
          <li>
            <strong>Breach</strong>. Breach these Terms or any agreement entered
            into pursuant to, or in connection with, these Terms.
          </li>
          <li>
            <strong>Defame</strong>. Act in a manner that is defamatory, trade
            libelous, threatening, or harassing.
          </li>
          <li>
            <strong>Engage In Fraudulent Activity</strong>. Engage in
            potentially fraudulent or suspicious activity and/or transactions.
            You must cooperate in any investigation or provide confirmation of
            your identity or the accuracy of any information you provide to us.
          </li>
          <li>
            <strong>Engage In Harmful Conduct</strong>. (1) Receive, or attempt
            to receive, funds from both INTUITION EXCHANGE and another user for
            the same transaction during the course of a dispute; (2) conduct
            your business or use the Services in a manner that results in, or
            may result in, complaints, disputes, claims, reversals, ACH returns,
            chargebacks, fees, fines, penalties, or other liability to INTUITION
            EXCHANGE, other users, third parties, or yourself; and (3) allow
            your Account(s) to have a negative balance.
          </li>
          <li>
            <strong>Incur ACH Returns or Chargebacks</strong>. Incur any ACH
            return or chargeback in connection with an ACH transaction between
            your personal bank account linked to your Account(s).
          </li>
          <li>
            <strong>Mislead</strong>. Provide false, inaccurate or misleading
            information in connection with your use of the Services, in
            communications with INTUITION EXCHANGE, or otherwise connected with
            these Terms.
          </li>
          <li>
            <strong>Introduce Harmful Code</strong>. Facilitate any viruses,
            Trojan horses, worms or other computer programming routines that may
            damage, detrimentally interfere with, surreptitiously intercept, or
            expropriate any system, data or information. You must not: (1) use
            an anonymizing proxy; (2) use any robot, spider, other automatic
            device, or manual process to monitor or copy our Website without our
            prior written permission; (3) use any temporary, disposable,
            self-destructive, or similar email address when opening an
            Account(s) and/or using the Services; (4) use any device, software,
            or routine to bypass our robot exclusion headers, or interfere or
            attempt to interfere with our Sites or the Services; (5) take any
            action that may cause us to lose any of the services from our
            Internet service providers, or other suppliers; and (6) take any
            action that imposes an unreasonable or disproportionately large load
            on our infrastructure.
          </li>
          <li>
            <strong>Violate Laws Or Rights</strong>. Violate, or attempt to
            violate, (1) any law, statute, or ordinance; (2) INTUITION
            EXCHANGE&rsquo;s or any third-party&rsquo;s copyright, patent,
            trademark, trade secret, or other intellectual property rights, or
            rights of publicity or privacy.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Liability</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Indemnification</strong>.&nbsp;You will indemnify and hold
            harmless INTUITION EXCHANGE, Related Parties and service providers,
            including the Staking Services Provider, and each of their
            respective officers, directors, employees, affiliates, agents,
            licensors, and contractors (
            <strong>&ldquo;Indemnified Persons&rdquo;</strong>) from and against
            any claims, suits, actions, demands, disputes, allegations, or
            investigations brought by any third-party, governmental authority,
            or industry body, and all liabilities, damages (actual and
            consequential), losses, costs, and expenses, including without
            limitation reasonable attorneys&rsquo; fees, arising out of or in
            any way connected with (1) your access to or use of the Services;
            (2) your breach or alleged breach of these Terms or your violation
            of any other provision of these Terms, including any terms and
            conditions incorporated by reference herein; (3) your violation of
            any law, rule, or regulation; and/or (4) your violation of the
            rights of any third-party. We reserve the right to assume control of
            the defense of any third-party claim that is subject to
            indemnification by you, in which event you will cooperate with us in
            asserting any available defenses.
          </li>
          <li>
            <strong>Limitations Of Liability</strong>. IN NO EVENT SHALL ANY OF
            THE INDEMNIFIED PERSONS BE LIABLE TO YOU OR ANY OTHER PERSON OR
            ENTITY FOR ANY LOSS OF BUSINESS, PROFITS OR OPPORTUNITIES, LOSS OF
            REPUTATION OR GOODWILL OR ANY SPECIAL, PUNITIVE, AGGRAVATED,
            INCIDENTAL, INDIRECT OR CONSEQUENTIAL LOSSES OR DAMAGES, WHETHER
            ARISING OUT OF OR IN CONNECTION WITH OUR SITES, THE PLATFORM, YOUR
            ACCOUNT(S), THE SERVICES, THESE TERMS, THE TRADING RULES, THE
            DISCLOSURES, THE PRIVACY POLICY, AND/OR ANY AGREEMENT ENTERED INTO
            PURSUANT TO, OR IN CONNECTION WITH, THESE TERMS OR OTHERWISE. OUR
            LIABILITY, AND THE LIABILITY OF THE INDEMNIFIED PERSONS, TO YOU OR
            ANY THIRD PARTIES IN ANY CIRCUMSTANCE IS LIMITED TO THE ACTUAL
            AMOUNT OF LOSS OR DAMAGE WHICH IS CAUSED DIRECTLY AND IS REASONABLY
            FORESEEABLE BY OUR BREACH OF THESE TERMS AND SHALL IN NO EVENT
            EXCEED $10,000. SUCH SUM SHALL BE PAID AS LIQUIDATED DAMAGES BY US
            TO YOU IN FULL AND FINAL SETTLEMENT AND SATISFACTION OF OUR ENTIRE
            LIABILITY AND THE INDEMNIFIED PERSONS&rsquo; ENTIRE LIABILITY FOR
            ANY LOSS OR DAMAGE WHICH IS CAUSED DIRECTLY AND IS REASONABLY
            FORESEEABLE BY OUR BREACH OF THESE TERMS. YOU ACKNOWLEDGE AND ACCEPT
            THAT DAMAGES ARE AN ADEQUATE REMEDY AND THAT YOU SHALL NOT BE
            ENTITLED TO ANY OTHER CLAIMS OR REMEDIES AT LAW OR IN EQUITY,
            INCLUDING BUT NOT LIMITED TO, ANY CLAIM IN REM, INJUNCTION, AND/OR
            SPECIFIC PERFORMANCE.
          </li>
          <li>
            <strong>No Warranty</strong>. THE SERVICES ARE PROVIDED ON AN
            &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT ANY
            REPRESENTATION OR WARRANTY, WHETHER EXPRESS OR IMPLIED, TO THE
            MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW: SPECIFICALLY, WE
            DISCLAIM ANY IMPLIED WARRANTIES OF TITLE, MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE AND/OR NON-INFRINGEMENT. WE DO NOT MAKE ANY
            REPRESENTATIONS OR WARRANTIES THAT ACCESS TO THE SITES, THE
            PLATFORM, ANY OF YOUR ACCOUNT(S), THE SERVICES, OR ANY OF THE
            MATERIALS CONTAINED THEREIN, WILL BE CONTINUOUS, UNINTERRUPTED,
            TIMELY, OR ERROR-FREE. WE WILL MAKE REASONABLE EFFORTS TO ENSURE
            THAT TRANSACTIONS ON THE PLATFORM ARE PROCESSED IN A TIMELY MANNER,
            BUT WE MAKE NO REPRESENTATIONS OR WARRANTIES REGARDING THE AMOUNT OF
            TIME NEEDED TO COMPLETE PROCESSING WHICH IS DEPENDENT UPON MANY
            FACTORS OUTSIDE OF OUR CONTROL.
          </li>
          <li>
            <strong>Security</strong>. Our Services support logins 2FA, which is
            known to reduce the risk of unauthorized use of or access to the
            Services. We will neither ask for you 2FA codes nor will our user
            support ask to screen share or otherwise seek access to your devices
            of Account(s). Always log into your Account(s) through the Sites to
            review any Transactions or required actions if you have any
            uncertainty regarding the authenticity of any communication or
            notice. INTUITION EXCHANGE is not liable for any damage or
            interruptions caused by any computer viruses, spyware, scareware,
            Trojan horses, worms, or other malware that may affect your computer
            or other equipment, or any phishing, spoofing, or other attack. We
            advise the regular use of a reputable and readily available virus
            screening and prevention software. You should also be aware that SMS
            and email services are vulnerable to spoofing and phishing attacks
            and should use care in reviewing messages purporting to originate
            from us. You are responsible for all login credentials, including
            usernames and passwords and must keep security details safe at all
            times. Additionally, you are responsible for securing any device
            through which you access your INTUITION EXCHANGE Account. INTUITION
            EXCHANGE is not liable for any losses that result from a failure to
            secure your device.
          </li>
          <li>
            <strong>No Liability For Breach</strong>. We are not liable for any
            breach of these Terms or any agreement entered into pursuant to, or
            in connection with, these Terms where the breach is due to abnormal
            and unforeseeable circumstances beyond our control, the consequences
            of which would have been unavoidable despite all effects to the
            contrary, nor are we liable where the breach is due to any action or
            inaction which is necessary or desirable in order to comply with any
            laws, rules, or regulations.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Data Protection</strong>
        </Typography.Title>
        <Typography.Paragraph>
          You acknowledge and agree that we may process personal data, including
          sensitive and biometric data in relation to you. Please review
          our&nbsp;Privacy Policy&nbsp;for more information on how we collect
          and use data relating to the use and performance of our Sites and
          Services.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>Intellectual Property</strong>
        </Typography.Title>
        <Typography.Paragraph>
          Unless otherwise indicated in these Terms, all copyright and other
          intellectual property rights in all information, data, text, code,
          images, links, sounds, graphics, videos, and other materials contained
          on our Sites or such other mode of access (including through the
          INTUITION EXCHANGE APIs) or provided in connection with the Services,
          including, without limitation, our logo and all designs, information,
          data, text, code, images, links, sounds, graphics, videos, other
          materials, and the selection and arrangement thereof
          (collectively,&nbsp;<strong>&ldquo;Materials&rdquo;</strong>) are
          INTUITION EXCHANGE&rsquo;s, its licensors, or suppliers&rsquo;
          property and are protected by U.S. and international copyright laws
          and other intellectual property rights laws. We hereby grant you a
          limited, nonexclusive, and non-sublicensable license to access and use
          the Materials for your non-commercial personal or internal business
          uses. Such license is subject to these Terms and does not permit (1)
          the resale of the Materials; (2) the distribution, public performance,
          or public display of any Materials; (3) the modification or derivative
          uses of the Materials; and (4) the use of the Materials other than for
          their intended purposes. The license granted under herein
          automatically terminates if we suspend or terminate your access to the
          Services.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>Trademarks</strong>
        </Typography.Title>
        <Typography.Paragraph>
          The Trademarks, service marks, and logos (
          <strong>&ldquo;Trademarks&rdquo;</strong>) used and displayed on or
          through the Sites or the Services are registered and unregistered
          Trademarks of the relevant mark owners of INTUITION EXCHANGE and our
          licensors. Nothing on the Sites should be construed as granting, by
          implication, estoppel, or otherwise, any license or right to use,
          copy, or imitate, in whole or in part, any Trademark displayed on the
          Sites, without our written permission or that of other Trademark
          owners. We prohibit the use of the Trademarks, any entity name, trade
          name, company name of ours or any other Trademark owned by us as a
          &ldquo;hot&rdquo; link to any website unless establishment of such a
          link is approved in advance by us in writing.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>Feedback</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>User Materials</strong>. If you provide any reviews, posts,
            information, data, and comments on the Sites (through our
            &ldquo;Contact Us&rdquo; pages or otherwise), via our Services, or
            to us (<strong>&ldquo;</strong>
            <strong>User Material&rdquo;</strong>), you hereby grant us a
            worldwide, irrevocable, perpetual, non-exclusive, royalty-free,
            sub-licensable, transferable license to take all acts comprised in
            the intellectual property rights in respect of such User Material,
            including without limitation the rights to use, exercise, reproduce,
            display, modify, communicate, adapt, perform, distribute, or develop
            the same in all forms of media whether now known or in the future
            invented, for the purposes of operating the Website and for our
            business purposes (including where permitted by law, data
            analytics). You represent and warrant that you own or have the
            necessary rights, consents, and permissions to grant the foregoing
            rights to us, and that your User Materials are your own original
            works and creations and/or in any case do not and will not infringe
            the intellectual property or other rights of any third-party. You
            agree and acknowledge that: (1) we are not responsible for any User
            Material (whether provided by you or by third parties) which may be
            made available on the Sites, and (2) use of any such User Material
            is at your own risk and that we do not provide any warranties in
            relation to the same. Any feedback and suggestions submitted to us
            via the Website or through the Services shall be deemed and remain
            our property, and we shall be free to use and disclose, for any
            purpose, any ideas, concepts, know-how or techniques contained in
            such information. We shall not be subject to any obligations of
            confidentiality or privacy regarding such submitted information
            except as agreed by the relevant INTUITION EXCHANGE group entity
            having the direct customer relationship or as otherwise specifically
            agreed or required by law.
          </li>
          <li>
            <strong>Removal Of Content</strong>. We shall have the right at our
            sole and absolute discretion to remove, modify or reject any content
            that you submit to, post or display on the Sites (including any User
            Material) which in our sole opinion is unlawful, violates these
            Terms, or could subject us or any of our affiliates, directors,
            employees, officers, or third-party service providers to liability.
            We shall have the right to take any enforcement actions as we deem
            appropriate at our sole discretion, including but not limited to
            giving a written warning to you, removing any User Material,
            recovering damages or other monetary compensation from you,
            suspending or terminating your Account(s) (if any), or suspending
            your access to the Sites. We shall also have the right to restrict,
            refuse, or ban you from any and all future use of any other product,
            service, and/or facility provided or offered by us.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Chat</strong>
        </Typography.Title>
        <Typography.Paragraph>
          At any time and in connection with any Service that INTUITION EXCHANGE
          provides, INTUITION EXCHANGE may make interactive online chat
          (&ldquo;Chat&rdquo;) services available to you. Subject to and
          consistent with&nbsp;No Warranty, INTUITION EXCHANGE makes no warranty
          that the Chat service will be available at any particular time or be
          free of fault or error, and accepts no liability for the accuracy of
          information provided or statements made via the Chatbot. If you are
          under the age of 18 years old and are invited to use the Chat service,
          you must not use the Chat service and you must leave the Site. During
          your use of the Chat service, you may interact with a bot, chatbot, or
          other non-human (each, a &ldquo;Chatbot&rdquo;). We will disclose the
          use of the Chatbot to the extent required by applicable law. When
          engaging with us through use of the Chat service, be advised that
          chats will be monitored and saved.
          <br />
          <br /> The Chat service is provided as a convenience, often to
          facilitate your understanding of INTUITION EXCHANGE&rsquo;s Services.
          Our Chat service will make reasonable efforts to provide you with
          accurate and current information based on your question or need.
          Nothing we communicate in the Chat service will be considered a legal
          agreement, representation, or warranty as to our Services, processes,
          decisions, or response times. Providing or participating in the Chat
          service does not constitute consent by you or us to use electronic
          records and signatures as a substitute for written documents. Any
          personal information shared with us when using the Chat service shall
          be subject to the applicable privacy-related policies and notices
          described in our&nbsp;Privacy Policy.
          <br />
          <br /> You will not use the Chat service to send any abusive,
          defamatory, dishonest, or obscene message, and doing so may result in
          termination of the Chat service session.
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>General Terms</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Sites&apos; Accuracy</strong>. Although we intend to provide
            accurate and timely information on the Sites, the Sites may not
            always be entirely accurate, complete, or current and may also
            include technical inaccuracies or typographical errors. In an effort
            to continue to provide you with as complete and accurate information
            as possible, information may, to the extent permitted by applicable
            law, be changed or updated from time to time without notice,
            including without limitation information regarding our policies,
            agreements, products, and services. Accordingly, you should verify
            all information before relying on it, and all decisions based on
            information contained on the Sites are your sole responsibility and
            we shall have no liability for any such decisions. Links to
            third-party websites (including, without limitation, content,
            materials, and/or information in the third-party websites) may be
            provided as a convenience but they are not controlled by us. You
            acknowledge and agree that we are not responsible for any aspect of
            the content, materials, information or services contained in any
            third-party websites accessible or linked from the Sites.
          </li>
          <li>
            <strong>Export Controls And Sanctions</strong>. Your use of the
            Services and Sites is subject to applicable requirements under
            export control laws and Sanctions. By trading Digital Assets on the
            Platform or accessing the Services, you agree that you will fully
            comply with any and all such requirements. You represent and warrant
            to us that you, and if applicable, any of your directors, officers,
            and employees are not any person: (1) that is the subject or target
            of any Sanctions; (2) named in any Sanctions-related list maintained
            by the U.S. Department of State, the U.S. Department of Commerce, or
            the U.S. Department of the Treasury, including the Specially
            Designated Nationals and Blocked Persons List, the Sectoral
            Sanctions Identifications List, and the Foreign Sanctions Evaders
            List, or any similar list maintained by any other relevant
            governmental authority; (3) located, organized, or resident in a
            country, territory or geographical region which is itself the
            subject or target of any territory-wide Sanctions (currently
            including, without limitation, the Crimea, Donetsk, and Luhansk
            regions of Ukraine, Cuba, Iran, North Korea, and Syria); and (4) any
            person owned or controlled by any such person or persons described
            in the foregoing clauses (1)-(3) (any such person described in the
            foregoing clauses (1)-(4) a&nbsp;
            <strong>&ldquo;Sanctioned Person&rdquo;</strong>). You are not
            permitted to transact in Digital Assets or use any of the Services
            if: (1) we are prohibited from providing Services to you under any
            applicable laws and regulations, including but not limited to
            applicable Sanctions; or (2) you intend to transact or deal with any
            Sanctioned Person, or otherwise transact or deal with any person in
            violation of Sanctions or in any manner that would cause any person,
            including INTUITION EXCHANGE, to be in violation of applicable
            Sanctions.
            <br /> To help the government fight the funding of terrorism and
            money laundering activities, Federal law requires all financial
            institutions to obtain, verify, and record information that
            identified each person who opens an account.
            <br /> What this means to you: When you open an account, we will ask
            for your name, address, date of birth for individuals, and any other
            information that will allow us to identify you. In certain
            situations, we may also ask to see a form of identification with
            your photograph. For entities we may ask to see formative documents,
            and for private investment vehicles and trusts we may ask to see
            evidence of source of funds and beneficial ownership or other
            identifying documents.
          </li>
          <li>
            <strong>
              Special Measures (Section 311) Customer Notification
            </strong>
            . INTUITION EXCHANGE Trading is also registered as a&nbsp;Money
            Services Business&nbsp;with FinCEN. As such, the U.S Department of
            the Treasury requires Intuition Exchange to notify their customers
            as follows: Pursuant to U.S regulations issued under Section 311 of
            the USA PATRIOT Act, 31 USC 5318A, Intuition Exchange is prohibited
            from establishing, maintaining, administering, or managing an
            account for, or on behalf of: Burmese banking institutions, as
            defined in 31 CFR &sect; 1010.651(a)(1); the Commercial Bank of
            Syria, as defined in 31 CFR &sect; 1010.653(a)(1), which includes
            Syrian Lebanese Commercial Bank; FBME Bank, Ltd., as defined in 31
            CFR &sect; 1010.658(a)(1); North Korean banking institutions, as
            defined in 31 CFR &sect; 1010.659(a)(1); Bank of Dandong, as defined
            in 31 CFR &sect; 1010.660(a)(1); and Iranian financial institutions,
            as defined in 31 CFR &sect; 1010.661(a)(1) (collectively
            &ldquo;Section 311 Entities&rdquo;). The regulations also require us
            to notify you that your account with Intuition Exchange may not be
            used to provide services to or on behalf of, or involve, any of the
            Section 311 Entities. If any Section 311 Entities are found to be
            indirectly using or accessing the account, we will be required to
            take appropriate steps to prevent such access, including terminating
            your account.
          </li>
          <li>
            <strong>Amendments</strong>. We may amend, supplement, and/or
            replace these Terms and any terms and conditions incorporated by
            reference, now or in the future, by posting on the Website or
            emailing to you the revised terms and conditions, and the revised
            terms and conditions shall be effective at such time. If you do not
            agree with any such amendment, supplement, or replacement of such
            terms and conditions, your sole and exclusive remedy is to terminate
            your use of the Services and close your Account(s).
          </li>
          <li>
            <strong>Relationship Of The Parties</strong>. You acknowledge and
            agree that: (1) INTUITION EXCHANGE is not holding any fiat monies
            and/or Digital Assets as your trustee, and is not acting as your
            broker, futures commission merchant, intermediary, agent, trustee,
            advisor or in any fiduciary capacity; and (2) no communication or
            information provided to you by us shall be considered or construed
            as any form of advice.
          </li>
          <li>
            <strong>Privacy Of Others</strong>. If you receive information about
            another user through the Platform or from utilizing our Services,
            you must keep the information confidential and only use it in
            connection with the Services and always in accordance with
            applicable laws and regulations. You must not disclose or distribute
            any user information to a third-party, or use the information in any
            manner except as reasonably necessary to effect a Transaction.
          </li>
          <li>
            <strong>Email Security</strong>. You shall keep the email account
            associated with your Account(s) (
            <strong>&ldquo;Email Account&rdquo;</strong>) secure against any
            attacks and unauthorized access. You are required to notify
            INTUITION EXCHANGE immediately if you have knowledge or have reason
            for suspecting that the security of your Email Account has been
            compromised or if there has been any unauthorized use of your Email
            Account. Under no circumstances shall any of the Indemnified Persons
            be responsible or liable for any direct or indirect losses
            (including loss of profits, business, or opportunities), damages or
            costs suffered by you or any person by reason of or arising from or
            as a consequence of any access (whether authorized or not) to your
            Email Account by any person, any breach of security of your Email
            Account, or any Transactions, Instructions, or operations effected
            by you or purported to be effected by you through your Email
            Account.
          </li>
          <li>
            <strong>Security Breach</strong>. If you suspect that your
            Account(s) or any of your security details have been compromised or
            if you become aware of any fraud or attempted fraud or any other
            security incident (including a cyber-security attack) affecting you
            and/or INTUITION EXCHANGE (together a&nbsp;
            <strong>&ldquo;Security Breach&rdquo;</strong>), you must
            immediately lock your Account(s) via the disable account function on
            the Website or via any other method as may be prescribed by
            INTUITION EXCHANGE from time to time, contact our user support via
            our&nbsp;Supportpage, and continue to provide accurate and up to
            date information throughout the duration of the Security Breach. You
            must take any steps that we may reasonably require to reduce,
            manage, or report any Security Breach. Failure to provide prompt
            notification of any Security Breach may be considered in our
            determination of the appropriate resolution of the matter.
          </li>
          <li>
            <strong>Contact Information</strong>. You are responsible for
            keeping your email address, address and any other contact
            information up to date in your Account(s) in order to receive any
            notices or alerts that we may send you (including notices or alerts
            of an actual or suspected Security Breach).
          </li>
          <li>
            <strong>Taxes</strong>. It is your responsibility to determine what
            U.S. tax filing obligations may apply to you. INTUITION EXCHANGE is
            not responsible for your overall tax filing obligations and
            recommends you work with a tax advisor to determine any tax
            obligations you may have. However, INTUITION EXCHANGE may withhold
            taxes and issue year-end tax reporting on your income from trading,
            rewards earned and staking.
          </li>
          <li>
            <strong>Unclaimed Property</strong>. If we hold your assets, and we
            are unable to contact you and have no record of your use of the
            Services for several years, applicable laws and regulations may
            require us to report our holdings of such fiat monies or Digital
            Assets as unclaimed property to the authorities in certain
            jurisdictions. We will try to locate you at the address shown in our
            records, but if we are unable to, we may be required to deliver any
            such fiat monies or Digital Assets to the authorities in certain
            jurisdictions as unclaimed property. We reserve the right to deduct
            a dormancy fee or other administrative charges in respect of such
            unclaimed monies or Digital Assets, as permitted by applicable laws
            and regulations.
          </li>
          <li>
            <strong>Entire Agreement</strong>. These Terms (including any
            documents, materials, or information incorporated by reference
            herein) set forth the entire understanding between you and INTUITION
            EXCHANGE with respect to the Services.
          </li>
          <li>
            <strong>Clause Headings</strong>. Clause headings in these Terms are
            for convenience only and shall not govern the meaning or
            interpretation of any provision of these Terms.
          </li>
          <li>
            <strong>Transfer</strong>. These Terms (including any documents,
            materials, or information incorporated by reference herein) are
            personal to you and you are not permitted to novate, transfer or
            assign your rights, interests, liabilities, and/or obligations to
            anyone else without our prior written consent. However, you hereby
            acknowledge and agree that we shall have sole and absolute
            discretion to novate, transfer, or assign these terms (including any
            documents, materials or information incorporated by reference
            herein) or any of our rights, interests, liabilities, and/or
            obligations at any time to anyone else, including, without
            limitation, in connection with any merger, acquisition, or other
            corporate reorganization involving INTUITION EXCHANGE.
          </li>
          <li>
            <strong>Security Interests</strong>. You undertake not to create any
            security over your fiat monies or Digital Assets held in any of your
            Account(s) without our prior written consent.
          </li>
          <li>
            <strong>Invalidity</strong>. If any provision of these Terms, terms
            and conditions or information incorporated by reference in these
            Terms is or becomes illegal, invalid, or unenforceable in any
            respect, the same shall not affect the legality, validity, or
            enforceability of any other provisions in these Terms.
          </li>
          <li>
            <strong>Enforcement Of Our Rights</strong>. INTUITION
            EXCHANGE&rsquo;s rights and remedies under these Terms are
            cumulative and not exclusive of any rights or remedies provided by
            law or by any other agreement. Any failure or delay on the part of
            INTUITION EXCHANGE to exercise any right or remedy under these Terms
            shall not operate as a waiver of such right or remedy. Any single or
            partial exercise of any right or remedy shall not preclude any other
            or further exercise thereof or the exercise of any other right or
            remedy.
          </li>
          <li>
            <strong>Language</strong>. These Terms may, at INTUITION
            EXCHANGE&rsquo;s sole and absolute discretion, be translated into a
            language other than the English language. You agree that any such
            translation shall only be for your convenience and the English text
            shall prevail in the event of any ambiguity, discrepancy or omission
            as between the English text and any translated text.
          </li>
          <li>
            <strong>Third-Party Rights</strong>. Nothing expressed or referred
            to in these Terms will be construed to give any person other than
            the parties to these Terms any legal or equitable right, remedy, or
            claim under or with respect to these Terms or any provision of these
            Terms, except as set out in this paragraph. These Terms and all of
            its provisions are for the sole and exclusive benefit of the parties
            to these Terms and their successors and permitted assigns, provided
            that the Staking Service Provider (including its Indemnified
            Parties) may rely on your representations, warranties, and covenants
            in connection with a defense of any claim or proceeding against
            them.
          </li>
          <li>
            <strong>Survival</strong>. All provisions of these Terms, which by
            their nature extend beyond the expiration or termination of these
            Terms, will continue to be binding and operate after the termination
            or expiration of these Terms.
          </li>
          <li>
            <strong>Governing Law And Jurisdiction</strong>. These Terms shall
            be construed in accordance with and governed for all purposes by the
            laws and public policy of the State of California applicable to
            contracts executed and to be wholly performed within such state.
          </li>
          <li>
            <strong>Force Majeure</strong>. INTUITION EXCHANGE shall not be
            liable for delays, failure in performance or interruption of service
            which result directly or indirectly from any cause or condition
            beyond its reasonable control, including, but not limited to, any
            act of God, significant market volatility, nuclear or natural
            disaster, pandemic, action or inaction of civil or military
            authorities, act of war, terrorism, sabotage, civil disturbance,
            strike or other labor dispute, accident, state of emergency,
            malfunction of equipment, interruption or malfunction of utility,
            communications, computer (hardware or software), Internet, or
            network provider services, other catastrophe or any other occurrence
            which is beyond INTUITION EXCHANGE&rsquo;s reasonable control.
          </li>
        </ul>
        <Typography.Title level={3}>
          <strong>Complaints</strong>
        </Typography.Title>
        <ul>
          <li>
            <strong>Submitting A Complaint</strong>. If you have a complaint,
            you may first open a ticket with Customer Service and work with
            Customer Service to resolve your issue. Once you have already done
            so, and Customer Service has been unable to resolve your issue,
            please email your complaint to&nbsp;resolutions@Intuition Exchange.
            In that email, you must provide your Customer Service ticket number,
            state the cause of your complaint, how you would like us to resolve
            the complaint, and any other information you believe to be relevant.
            Without a Customer Service ticket, your complaint email will be
            deemed premature and will not receive a response. Upon receiving
            your complaint, we will open a support ticket and a user complaints
            officer (<strong>&ldquo;Complaint Officer&rdquo;</strong>) will
            review your complaint. The Complaint Officer will review your
            complaint without prejudice, based on the information you provided
            and any information we may derive from our records. Within thirty
            business days ((all days excluding Saturday, Sundays, and any bank
            holiday in the State of California) (
            <strong>&ldquo;Business Days&rdquo;</strong>)) of our receipt of
            your complaint, the Complaint Officer will use reasonable efforts to
            address the points raised in your complaint and the Complaint
            Officer may: (1) offer to resolve your complaint in the way you have
            requested; (2) reject your complaint and set out the reasons for the
            rejection; or (3) offer to resolve your complaint with an
            alternative proposal or solution. In exceptional circumstances, if
            the Complaint Officer is unable to respond to your complaint within
            thirty Business Days, the Complaint Officer will use reasonable
            efforts to send you a holding response indicating the reasons for a
            delay in answering your complaint and specifying the deadline by
            which the Complaint Officer will respond to your complaint.
          </li>
          <li>
            <strong>Offers</strong>. Any offer of resolution made to you will
            only become binding on INTUITION EXCHANGE if accepted by you. An
            offer of resolution will not constitute any admission by us of
            wrongdoing or liability regarding the complaint&rsquo;s subject
            matter.
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
        <Typography.Title level={3}>
          <strong>Class Action Waiver</strong>
        </Typography.Title>
        <Typography.Paragraph>
          <strong>
            TO THE EXTENT PERMITTED BY LAW, ALL CLAIMS MUST BE BROUGHT IN A
            PARTY
          </strong>
          <strong>
            &rsquo;S INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER
            IN ANY PURPORTED CLASS, COLLECTIVE ACTION, OR REPRESENTATIVE
            PROCEEDING. UNLESS BOTH YOU AND INTUITION EXCHANGE AGREE, NO
            ARBITRATOR OR JUDGE MAY CONSOLIDATE MORE THAN ONE PERSON
          </strong>
          <strong>
            &rsquo;S CLAIMS OR ENGAGE IN ANY CLASS ARBITRATION. BY AGREEING TO
            THESE TERMS, YOU ACKNOWLEDGE THAT YOU AND INTUITION EXCHANGE EACH
            WAIVE THE RIGHT TO: (1) A JURY TRIAL; AND (2) PARTICIPATE IN A CLASS
            ACTION. IF A COURT DECIDES THAT APPLICABLE LAW PRECLUDES ENFORCEMENT
            OF ANY OF THIS PARAGRAPH
          </strong>
          <strong>
            &rsquo;S LIMITATIONS AS TO A PARTICULAR CLAIM FOR RELIEF, THEN THAT
            CLAIM (AND ONLY THAT CLAIM) MUST BE SEVERED FROM THE ARBITRATION AND
            MAY BE BROUGHT IN COURT. THIS CLASS ACTION WAIVER IS SUBJECT TO AND
            DOES NOT IMPAIR OR IMPEDE INTUITION EXCHANGE
          </strong>
          <strong>&rsquo;</strong>
          <strong>
            S RIGHT TO CONSOLIDATE RELATED USER CLAIMS AS DESCRIBED ABOVE.
          </strong>
        </Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>Contact Us</strong>
        </Typography.Title>
        <Typography.Paragraph>
          Please contact us if you have any questions about these Terms. We will
          respond within a reasonable timeframe. You may contact us via
          our&nbsp;Support&nbsp;page or at our mailing address below:
        </Typography.Paragraph>
        <Typography.Paragraph>INTUITION EXCHANGE.</Typography.Paragraph>
        <Typography.Paragraph>California</Typography.Paragraph>
        <Typography.Title level={3}>
          <strong>State License Disclosures</strong>
        </Typography.Title>
        <Typography.Paragraph>
          INTUITION EXCHANGE maintains licenses to engage in money transmission
          activities (or the statutory equivalent) in several U.S. states and
          territories. Regulatory requirements may impact INTUITION
          EXCHANGE&rsquo;s provision of the Services to you and your use of
          certain Services, depending on where you live. INTUITION
          EXCHANGE&rsquo;s licenses and corresponding required disclosures can
          be found on the INTUITION EXCHANGE Licenses page, which is
          incorporated here by reference.
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
