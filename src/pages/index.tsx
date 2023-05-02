import { type NextPage } from "next";
import dynamic from "next/dynamic";

const Home: NextPage = () => {
  const MainMap = dynamic(() => import("../components/MainMap"), {
    ssr: false, // Disable server-side rendering of the map
    // (Otherwise, leaflet throws an error because it can't find the window object
    // during server-side rendering)
  });

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex h-screen w-full bg-black">
        <MainMap />
      </div>
    </div>
  );
};

export default Home;
