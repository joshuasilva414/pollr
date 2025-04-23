import { UserButton } from "@clerk/nextjs";

import { SignInButton, SignedOut } from "@clerk/nextjs";

import { SignedIn } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center p-4 border-b">
      <div>
        <h1 className="text-2xl font-bold">Pollr</h1>
      </div>
      <div className="flex items-center gap-4">
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}
