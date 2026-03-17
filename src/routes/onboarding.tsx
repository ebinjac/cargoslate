import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { authClient } from '../lib/auth-client';
import { useState } from 'react';
import { getSession } from '../lib/server/session';

export const Route = createFileRoute('/onboarding')({
  beforeLoad: async () => {
    const session = await getSession();
    if (!session?.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const [orgName, setOrgName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!orgName) {
        setError('Workspace name is required.');
        setLoading(false);
        return;
    }

    const { error } = await authClient.organization.create({
      name: orgName,
      slug: orgName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    });

    if (error) {
      setError(error.message || 'Failed to create workspace');
      setLoading(false);
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create your workspace</CardTitle>
          <CardDescription>CargoSlate is organized around workspaces. Create one for your company.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateWorkspace} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Company/Workspace Name</Label>
              <Input id="orgName" type="text" placeholder="Acme Logistics" value={orgName} onChange={e => setOrgName(e.target.value)} required />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
