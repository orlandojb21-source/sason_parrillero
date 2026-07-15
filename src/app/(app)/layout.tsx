import { requireAuth } from "@/lib/session";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="flex min-h-screen flex-1">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo.png"
          alt=""
          className="h-[65vmin] w-[65vmin] max-h-[32rem] max-w-[32rem] rounded-full object-cover opacity-[0.12] grayscale"
        />
      </div>
      <div className="relative z-10 flex flex-1">
        <Sidebar rol={session.user.rol} />
        <div className="flex flex-1 flex-col">
          <Topbar nombre={session.user.name} rol={session.user.rol} imagen={session.user.image} />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
