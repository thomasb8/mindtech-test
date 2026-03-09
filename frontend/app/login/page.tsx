'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLogin } from '@/lib/hooks/useAuth';
import { useRedirectIfAuth } from '@/lib/hooks/useAuthRedirect';

export default function LoginPage() {
  const router = useRouter();
  useRedirectIfAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login.mutate({ email, password }, {
      onSuccess: ({ access_token }) => {
        localStorage.setItem('token', access_token);
        router.push('/restaurants');
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {login.isError && <p className="text-sm text-red-500">{login.error.message}</p>}
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending ? 'Logging in...' : 'Login'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              No account? <a href="/register" className="underline">Register</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
