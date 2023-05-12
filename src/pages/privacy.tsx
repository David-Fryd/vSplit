import { type NextPage } from "next";
import Image from "next/image";

const About: NextPage = () => {
  return (
    <div className="flex w-full flex-col  border-2 bg-neutral-900 p-2 text-neutral-50">
      {/* <p className="text-center text-4xl font-bold text-green-500">ABOUT</p> */}
      <div className="flex items-center gap-x-2 ">
        <Image
          src="/vSplit_logo.png"
          alt="vSplit logo"
          width={50}
          height={50}
        />
        <p className="text-center font-mono text-4xl font-bold">vSplit</p>
      </div>

      <div className="text-content flex flex-col items-center justify-center gap-y-5 text-lg">
        <div></div>
        <p className=" pb-4 text-center text-5xl font-bold">Privacy Policy</p>
        <p className="w-3/4 ">
          vSplit (<span className="font-mono">www.vsplit.net</span>) is an
          open-source sector configuration mapping tool for VATSIM. This Privacy
          Policy document details the types of information that are collected
          and recorded by vSplit, and how that data is used.
        </p>
        <p className="w-3/4 ">
          If you have any questions regarding the privacy policy or want
          additional information, please{" "}
          <a
            className="italic text-blue-500 underline"
            href="https://github.com/David-Fryd/vSplit/labels/Privacy%20Policy"
          >
            submit a pull request
          </a>{" "}
          to the open-source <b>vSplit</b> repostiry, and label your post with
          the &quot;Privacy Policy&quot; tag.
        </p>
        <p className=" w-3/4 ">
          This privacy policy applies only to online activities related to{" "}
          <b>vSplit</b> and is valid for visitors to our website regarding the
          information that is shared and/or collected by <b>vSplit</b>. This
          policy does not apply to any information not gathered directly through
          the <b>vSplit</b> website.
        </p>
        <p className="pt-4 text-center text-4xl font-bold">Consent</p>
        <p className=" w-3/4 ">
          By using our website, you hereby consent to our Privacy Policy and
          agree to the terms detailed in this privacy policy document.
        </p>
        <p className="pt-4 text-center text-4xl font-bold">
          Open Source Guarantee
        </p>
        <p className=" w-3/4 ">
          This software is and will remain open source. This means that the
          entire source code is publically available such that any claims made
          about the behavior and data-collection procedures of the software are
          verifiable by anyone. The source code is readily available on the{" "}
          <a
            className="italic text-blue-500 underline"
            href="https://github.com/David-Fryd/vSplit/"
          >
            vSplit GitHub repository
          </a>
          .
        </p>
        <p className="pt-4 text-center text-4xl font-bold">
          Information We Collect
        </p>
        <p className=" w-3/4 text-center">
          <b>vSplit</b> has two levels of data-collection based on how a user
          interacts with the service.
        </p>
        <p className="w-3/4 text-2xl font-bold">Non-Authenticated Users</p>
        <p className="w-3/4">
          Non-Authenticated Users never log in or explicitly enter data about
          themselves. For these users, data collection is limited to Log Files
          and Cookies as described later in the document. Non-Authenticated
          Users are able to interact with the map and any other page not
          explicitly denoting the requirement of authentication without
          subjecting themselves to additional data collection.
        </p>

        <p className="w-3/4 text-2xl font-bold">Authenticated Users</p>
        <p className="w-3/4">
          <b>vSplit</b> stores a very limited amount of personally identifiable
          information which includes but is not limited to your{" "}
          <span className="italic">name, email address and VATSIM CID</span>.
          All information will be collected through the VATSIM Connect system
          during the sign in process. When using the protected/authenticated
          service sections of the <b>vSplit</b> application, you will be
          required to enter your name (or a variation of your name in accordance
          with the VATSIM CoC), VATSIM CID and VATSIM password. This data is
          used to connect to the VATSIM servers and will <b>not</b> be collected
          by <b>vSplit</b>. You can refer to the{" "}
          <a
            className="italic text-blue-500 underline"
            href="https://vatsim.net/docs/policy/privacy-policy"
          >
            VATSIM privacy policy
          </a>{" "}
          for further details on how VATSIM handles your data.
        </p>
        <p className="pt-4 text-center text-4xl font-bold">Information Usage</p>
        <p className="w-3/4">
          The ways in which <b>vSplit</b> uses the information we collect about
          Authenticated Users includes:
        </p>
        <ul className="w-3/4 list-disc">
          <li>Verify VATSIM account status</li>
          <li>Verify VATSIM controller rating</li>
          <li>
            Validate access to protected pages on <b>vSplit</b>
          </li>
          <li>
            Authenticate protected requests made to the <b>vSplit</b> server
          </li>
        </ul>

        <p className="pt-4 text-center text-4xl font-bold">Log Files</p>
        <p className=" w-3/4">
          <b>vSplit</b> follows a standard procedure of using log files. These
          files log visitors when they visit websites. All hosting companies do
          this and a part of hosting services&apos; analytics. The information
          collected by log files include internet protocol (IP) addresses,
          browser type, Internet Service Provider (ISP), date and time stamp,
          referring/exit pages, and possibly the number of clicks. These are not
          linked to any information that is personally identifiable. The purpose
          of the information is for analyzing trends, administering the site,
          tracking users&apos; movement on the website, and gathering
          demographic information.
        </p>
        <p className="pt-4 text-center text-4xl font-bold">Use of Cookies</p>
        <p className=" w-3/4">
          Like most other websites, <b>vSplit</b> uses &apos;cookies&apos;.
          These cookies are used to store information including visitors&apos;
          preferences, authentication state, and the pages on the website that
          the visitor accesses or visits. The information is used to enable
          authenticated use of the service, and optimize the users&apos;
          experience by customizing our web page content based on visitors&apos;
          browser type and/or other information.
        </p>
        <p className="pt-4 text-center text-4xl font-bold">
          GDPR Privacy Policy (Data Protection Rights)
        </p>
        <p className="w-3/4 text-center">
          Every user is entitled to the following data protection rights:
          <ul className="text-md list-disc p-4 text-left">
            <li>
              <b>The right to access</b> - You have the right to request copies
              of your personal data. We may charge you a small fee for this
              service.
            </li>
            <li>
              <b>The right to rectification</b> - You have the right to request
              that we correct any information you believe is inaccurate. You
              also have the right to request that we complete the information
              you believe is incomplete.
            </li>
            <li>
              <b>The right to erasure</b> - You have the right to request that
              we erase your personal data, under certain conditions.{" "}
            </li>
            <li>
              <b>The right to restrict processing</b> - You have the right to
              request that we restrict the processing of your personal data,
              under certain conditions.
            </li>
            <li>
              <b>The right to object to processing</b> - You have the right to
              object to our processing of your personal data, under certain
              conditions.
            </li>
            <li>
              <b> The right to data portability</b> - You have the right to
              request that we transfer the data that we have collected to
              another organization, or directly to you, under certain
              conditions.
            </li>
          </ul>
          If you make a request, we have one month to respond to you. If you
          would like to exercise any of these rights, please contact us.
        </p>
        <div className="p-8" />
      </div>
    </div>
  );
};

export default About;
