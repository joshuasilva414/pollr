import Client from "./client";
export default async function Page({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  if (!roomId) {
    return <div>No room ID</div>;
  }
  return (
    <>
      <Client roomId={roomId} />
    </>
  );
}
