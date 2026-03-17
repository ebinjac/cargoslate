import { 
  Sidebar, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarGroup, 
  SidebarMenuButton, 
  SidebarHeader, 
  SidebarContent, 
  SidebarGroupLabel, 
  SidebarGroupContent 
} from "../ui/sidebar";
import { Link, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, FileText, FolderOpen, Settings, Users, CreditCard, Palette, Anchor } from "lucide-react";

export function AppSidebar({ role }: { role: string }) {
  const isManagerOrOwner = role === "manager" || role === "owner";
  const isOwner = role === "owner";
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r border-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="border-b border-border/50 h-16 flex items-center px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <Anchor className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">Cargo<span className="text-primary">Slate</span></span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/dashboard" />} isActive={isActive("/dashboard")} tooltip="Dashboard">
                <LayoutDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/documents" />} isActive={isActive("/documents")} tooltip="All Documents">
                  <FileText />
                  <span>All Documents</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/documents/new" />} isActive={isActive("/documents/new")} tooltip="New Document">
                  <FileText />
                  <span>New Document</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Templates</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/templates" />} isActive={isActive("/templates")} tooltip="All Templates">
                  <FolderOpen />
                  <span>All Templates</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isManagerOrOwner && (
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link to="/templates/new" />} isActive={isActive("/templates/new")} tooltip="New Template">
                    <FolderOpen />
                    <span>New Template</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<Link to="/settings/workspace" />} isActive={isActive("/settings/workspace")} tooltip="Workspace">
                  <Settings />
                  <span>Workspace</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {isManagerOrOwner && (
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link to="/settings/branding" />} isActive={isActive("/settings/branding")} tooltip="Branding">
                    <Palette />
                    <span>Branding</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {isOwner && (
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link to="/settings/team" />} isActive={isActive("/settings/team")} tooltip="Team Members">
                    <Users />
                    <span>Team Members</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              {isOwner && (
                <SidebarMenuItem>
                  <SidebarMenuButton render={<Link to="/settings/billing" />} isActive={isActive("/settings/billing")} tooltip="Billing">
                    <CreditCard />
                    <span>Billing</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
