import { createMiddleware } from "@tanstack/react-start";
import { getSession } from "./session";
import { redirect } from "@tanstack/react-router";
import { auth } from "../auth";
import { getRequest } from "@tanstack/react-start/server";

export const requireAuth = createMiddleware().server(async ({ next }) => {
  const session = await getSession();
  if (!session?.user) {
    throw redirect({ to: "/login" });
  }
  return next({ context: { user: session.user, session: session.session } });
});

export const requireRole = (allowedRoles: string[]) => 
  createMiddleware().server(async ({ next }) => {
    const session = await getSession();
    if (!session?.user) throw redirect({ to: "/login" });
    
    const request = getRequest();
    if (!request) throw redirect({ to: "/login" });

    // Assuming we can get the active organization from headers via better auth
    const activeOrg = await auth.api.getFullOrganization({
        headers: request.headers
    });
    
    if (!activeOrg) throw redirect({ to: "/onboarding" });
    
    const userMember = activeOrg.members.find((m: any) => m.userId === session.user.id);
    
    if (!userMember || !allowedRoles.includes(userMember.role)) {
       throw redirect({ to: "/dashboard" });
    }

    return next({ 
        context: { 
            user: session.user, 
            session: session.session, 
            organization: activeOrg, 
            role: userMember.role 
        } 
    });
});
