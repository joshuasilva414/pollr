import RoomMenu from "@/components/room-menu";

export default function Home() {
  return (
    <div>
      <main className="w-full md:w-3/4 mx-4 md:mx-auto">
        <h1 className="text-center text-2xl font-bold my-4">
          Join or Create a Room
        </h1>
        <div>
          <RoomMenu />
        </div>
      </main>
    </div>
  );
}
