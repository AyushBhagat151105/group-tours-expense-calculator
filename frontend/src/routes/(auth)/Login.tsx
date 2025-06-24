import { handleGoogleLogin } from '@/lib/handleGoogleLogin';
import { useAuthStore } from '@/store/useAuthStore';
import { useForm } from "react-hook-form"
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { loginSchema } from '@/validation/zod';
import type { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FcGoogle } from "react-icons/fc"

export const Route = createFileRoute('/(auth)/Login')({
  component: RouteComponent,
})
type LoginFormData = z.infer<typeof loginSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.signIn);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    const user = await login(data);
    if (user?.isVerified) {
      navigate({ to: '/' });
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-background">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="******" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>

      <div className="my-4 text-center text-muted-foreground">or</div>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 transition-all duration-200"
        onClick={handleGoogleLogin}
      >
        <FcGoogle className="text-xl" />
        <span className="font-medium">Sign up with Google</span>
      </Button>
    </div>
  );
}
