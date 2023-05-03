import { type NextPage } from "next";

const About: NextPage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center border-2 bg-neutral-900">
      <div className="flex h-screen w-1/2 flex-col items-center justify-center  p-2 font-mono text-neutral-50">
        <p className="text-center text-4xl font-bold text-green-500">ABOUT</p>
        <div className="p-4" />
        <p className="text-center text-4xl">Easy Flash!</p>
      </div>
    </div>
  );
};

export default About;
