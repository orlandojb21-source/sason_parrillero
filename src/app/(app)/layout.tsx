import { requireAuth } from "@/lib/session";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="flex min-h-screen flex-1">
      <Sidebar rol={session.user.rol} />
      <div className="flex flex-1 flex-col">
        <Topbar nombre={session.user.name} rol={session.user.rol} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
