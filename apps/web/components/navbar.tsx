import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div>
        <Link href="/">
          <h1 className="text-2xl font-bold">Pollr</h1>
        </Link>
      </div>
      {/* <div className="flex items-center gap-4"></div> */}
    </header>
  );
}
