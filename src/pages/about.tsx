import { type NextPage } from "next";
import Image from "next/image";

const About: NextPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center border-2 bg-neutral-900">
      <div className="flex h-screen w-1/2 flex-col items-center justify-center  p-2 font-mono text-neutral-50">
        {/* <p className="text-center text-4xl font-bold text-green-500">ABOUT</p> */}
        <div className="p-4" />
        <div className="flex items-center gap-x-2">
          <Image
            src="/vSplit_logo.png"
            alt="vSplit logo"
            width={50}
            height={50}
          />
          <p className="text-center text-4xl font-bold">vSplit</p>
        </div>
        <div className="p-4" />
        <p className="text-center text-2xl italic">
          An open-source sector configuration mapping tool for VATSIM.
        </p>
        <div className="p-8" />
        <p>Work In Progress</p>
      </div>
    </div>
  );
};

export default About;
