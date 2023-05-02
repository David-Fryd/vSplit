import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Header from "~/components/Header";

const Home: NextPage = () => {
  const MainMap = dynamic(() => import("../components/MainMap"), {
    ssr: false, // Disable server-side rendering of the map
    // (Otherwise, leaflet throws an error because it can't find the window object
    // during server-side rendering)
  });

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <div className="h-screen w-full bg-neutral-500">
        {/* <Header /> */}
        <MainMap />
      </div>
    </div>
  );
};

export default Home;
