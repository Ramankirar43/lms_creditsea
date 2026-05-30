'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { AuthFormSkeleton, AuthPageShell } from '@/components/layout/auth-page-shell';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getDefaultRoute } from '@/hooks/useAuthGuard';
import { useMounted } from '@/hooks/use-mounted';
import { toast } from '@/hooks/use-toast';
import { getErrorMessage } from '@/services/api';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const mounted = useMounted();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await authService.login(data);
      setAuth(res.data.data.token, res.data.data.user);
      toast({ title: 'Welcome back!', description: `Logged in as ${res.data.data.user.name}` });
      router.push(getDefaultRoute(res.data.data.user.role));
    } catch (error) {
      toast({ title: 'Login failed', description: getErrorMessage(error), variant: 'destructive' });
    }
  };

  return (
    <AuthPageShell
      title="Sign in"
      description="Access your borrower portal or operations dashboard"
    >
      {!mounted ? (
        <AuthFormSkeleton />
      ) : (
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" autoComplete="email" {...register('email')} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            No account?{' '}
            <Link href="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardContent>
      )}
    </AuthPageShell>
  );
}
