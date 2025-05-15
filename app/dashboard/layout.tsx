import Sidenav from "../ui/dashboard/sidenav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-auto font-[family-name:var(--font-geist-sans)]">
        <Sidenav />
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
}
