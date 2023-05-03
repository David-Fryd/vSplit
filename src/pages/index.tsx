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

// // getServerSideProps:
// export function getServerSideProps() {
//   // Fetch data using the facilitydata trpc API
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
//   // BROKEN: Causes  `TypeError: Cannot read properties of null (reading 'useContext')`
//   const data = api.facilitydata.getAllSector.useQuery();
//   // Pointless await:

//   // // Fetch data from external API
//   // const res = await fetch(`https://.../data`)
//   // const data = await res.json()

//   // // Pass data to the page via props
//   return { props: { data } };
// }
