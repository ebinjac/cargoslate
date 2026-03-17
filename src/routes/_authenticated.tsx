import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppSidebar } from "../components/layout/app-sidebar";
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar";
import { getSession } from "../lib/server/session";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/login" });
    }
    // Hardcode role to owner until full auth connection is established via middleware context
    const role = "owner"; 
    return { session, role };
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { role } = Route.useRouteContext();
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
