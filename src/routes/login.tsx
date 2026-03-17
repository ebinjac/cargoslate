import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { authClient } from '../lib/auth-client';
import { useState } from 'react';

export const Route = createFileRoute('/login')({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || 'Failed to login');
      setLoading(false);
    } else {
      navigate({ to: '/dashboard' });
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setLoading(true);
    await authClient.sendVerificationEmail({
        email: email,
        callbackURL: "/"
    });
    setError("Verification email sent! Check your inbox.");
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-destructive">{error}</p>
                {(error.toLowerCase().includes('verify') || error.toLowerCase().includes('email')) && (
                  <Button type="button" variant="link" className="p-0 h-auto text-sm justify-start font-normal text-muted-foreground hover:text-primary" onClick={handleResendVerification}>
                    Resend verification email
                  </Button>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 bg-border h-px"></div>
              <span className="text-xs text-muted-foreground uppercase">Or continue with</span>
              <div className="flex-1 bg-border h-px"></div>
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
            Google
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 text-center text-sm">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
