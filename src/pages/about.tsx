import { type NextPage } from "next";
import Image from "next/image";

const About: NextPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center border-2 bg-neutral-900">
      <div className="flex h-screen w-1/2 flex-col items-center justify-center  p-2  text-neutral-50">
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
        <div className="p-4" />
        <p className="text-justify text-lg">
          ARTCCs define how to split up their airspace into sectors, which are 3
          dimensional shapes (boundaries and altitude assignments) that have
          their own ID (and usually name/label). Oftentimes, these sectors are
          combined and distributed into groups of responsibility. This
          &quot;splitting&quot; of groups is tedious, and the best way of doing
          it currently is sitting down and manually drawing out what you want
          the &quot;split&quot; to be. there are many different standard splits,
          and splits that are specific to events, making it difficult for
          controllers to know how to hand off aircraft and who is currently
          responsible for a given piece of airspace. This tool allows
          controllers to see what the split looks like at any given time by
          enabling ARTCCs to define their sectors, and for
          authenticated/authorized controllers to shuffle around the groupings
          of sectors.
        </p>
      </div>
    </div>
  );
};

export default About;
