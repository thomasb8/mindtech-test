'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRegister } from '@/lib/hooks/useAuth';
import { useRedirectIfAuth } from '@/lib/hooks/useAuthRedirect';

export default function RegisterPage() {
  const router = useRouter();
  useRedirectIfAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = useRegister();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    register.mutate({ name, email, password }, {
      onSuccess: () => router.push('/login'),
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {register.isError && <p className="text-sm text-red-500">{register.error.message}</p>}
            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending ? 'Registering...' : 'Register'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account? <a href="/login" className="underline">Login</a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
