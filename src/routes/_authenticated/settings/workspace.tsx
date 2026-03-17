import { createFileRoute, useRouter } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Button } from '../../../components/ui/button';
import { authClient } from '../../../lib/auth-client';
import { useState, useEffect } from 'react';
import { Separator } from '../../../components/ui/separator';

export const Route = createFileRoute('/_authenticated/settings/workspace')({
  component: WorkspaceSettingsPage,
});

function WorkspaceSettingsPage() {
  const router = useRouter();
  const { data: orgData, isPending } = authClient.useActiveOrganization();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (orgData?.name) setName(orgData.name);
  }, [orgData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgData?.id || !name) return;
    
    setLoading(true);
    await authClient.organization.update({
      organizationId: orgData.id,
      data: { name },
    });
    setLoading(false);
    router.invalidate();
  };

  const handleDelete = async () => {
    if (!orgData?.id) return;
    if (confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
      setDeleteLoading(true);
      await authClient.organization.delete({ organizationId: orgData.id });
      setDeleteLoading(false);
      window.location.href = '/dashboard';
    }
  };

  if (isPending) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Workspace Settings</h2>
        </div>
        <Card className="max-w-2xl animate-pulse">
            <CardHeader className="h-24 bg-muted/50 rounded-t-xl" />
            <CardContent className="h-48" />
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Workspace Settings</h2>
      </div>

      <div className="grid gap-6">
        <Card className="max-w-2xl">
          <form onSubmit={handleUpdate}>
            <CardHeader>
              <CardTitle>Organization Basics</CardTitle>
              <CardDescription>
                Update your workspace name and view your organization slug.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="org-name">Workspace Name</Label>
                <Input
                  id="org-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Logistics"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="org-slug">Workspace Slug</Label>
                <Input
                  id="org-slug"
                  value={orgData?.slug || ''}
                  disabled
                  className="bg-muted text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The slug is a unique identifier and cannot be changed after creation.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Created On</Label>
                <div className="text-sm border rounded-lg px-3 py-2 bg-muted/30">
                  {orgData?.createdAt ? new Date(orgData.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-between">
              <p className="text-sm text-muted-foreground">
                Changes will be reflected across the entire workspace.
              </p>
              <Button type="submit" disabled={loading || name === orgData?.name}>
                {loading ? 'Saving...' : 'Save changes'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Danger Zone */}
        <Card className="max-w-2xl border-destructive/20 bg-destructive/5 dark:bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">Danger Zone</CardTitle>
            <CardDescription className="text-destructive/80">
              Irreversible and destructive actions. Proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator className="bg-destructive/10" />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Delete Workspace</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently remove this workspace and all of its data. This action cannot be undone.
                </p>
              </div>
              <Button 
                 variant="destructive" 
                 onClick={handleDelete}
                 disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Workspace'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
