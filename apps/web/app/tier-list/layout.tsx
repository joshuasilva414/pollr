import ClerkInstant from "@/components/clerk-instant";

export default function TierListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkInstant>
      <div>{children}</div>
    </ClerkInstant>
  );
}
