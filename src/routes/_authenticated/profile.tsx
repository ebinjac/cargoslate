import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getSession } from "../../lib/server/session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { data: sessionData } = useQuery({
    queryKey: ['session'],
    queryFn: async () => await getSession(),
  });

  const user = sessionData?.user;

  if (!user) return null;

  const initials = user.name ? user.name.slice(0, 2).toUpperCase() : "USR";

  return (
    <div className="max-w-4xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
      <div className="flex items-center gap-4 py-8 border-b border-border/40">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
      </div>

      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <nav className="flex flex-col gap-1 text-sm text-muted-foreground font-medium">
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 bg-accent text-accent-foreground font-semibold rounded-md">
            Personal Info
          </Link>
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-accent/50 hover:text-accent-foreground transition-colors rounded-md">
            Security
          </Link>
          <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-accent/50 hover:text-accent-foreground transition-colors rounded-md">
            Notifications
          </Link>
        </nav>

        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your photo and personal details here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20 border border-border/50">
                <AvatarImage src={user.image || ''} />
                <AvatarFallback className="text-xl bg-accent/10 text-accent-foreground font-bold">{initials}</AvatarFallback>
              </Avatar>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Change Avatar</Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">Remove</Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue={user.name || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user.email} disabled className="bg-muted/50" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea 
                id="bio"
                className="flex w-full border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-y rounded-md"
                defaultValue="Logistics professional utilizing CargoSlate."
              />
            </div>
          </CardContent>
          <CardFooter className="border-t border-border pt-6 flex justify-end">
            <Button className="font-semibold">Save Changes</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
