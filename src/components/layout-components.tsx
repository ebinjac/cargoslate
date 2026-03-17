import { Link } from "@tanstack/react-router";
import { Anchor, LogOut, Settings as SettingsIcon, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  user?: {
    name?: string | null;
    image?: string | null;
  };
  isLoading?: boolean;
  onLogout?: () => void;
  navigate: (path: { to: string }) => void;
}

export function Header({ user, isLoading, onLogout, navigate }: HeaderProps) {
  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : "US";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground">
      <div className="container mx-auto px-4 md:px-6 flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Anchor className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Cargo<span className="text-primary">Slate</span></span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoading ? (
            <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="hidden sm:inline-flex items-center justify-center rounded-md border border-border bg-background px-3 h-8 text-xs font-semibold hover:bg-muted">Dashboard</Link>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button type="button" className="flex items-center gap-2 hover:bg-accent p-1 transition-colors rounded-full outline-none focus-visible:ring-2 ring-primary">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user.image || ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-bold">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-semibold leading-none">{user.name || "User"}</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 rounded-md border border-border shadow-md" align="end" sideOffset={4}>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-medium text-xs text-muted-foreground">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate({ to: '/profile' })}>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate({ to: '/dashboard' })}>
                      <SettingsIcon className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground font-medium" onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-medium hover:underline">Sign In</Link>
              <Link to="/register" className="rounded-md h-8 px-3 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold flex items-center justify-center">Get Started</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-8 bg-background border-t border-border">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Anchor className="h-4 w-4" />
          <span className="font-semibold text-foreground">CargoSlate</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="hover:underline">Terms</Link>
          <Link to="/" className="hover:underline">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}
