import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { handleGoogleLogin } from '@/lib/handleGoogleLogin';
import { useAuthStore } from '@/store/useAuthStore';
import { signUpSchema } from '@/validation/zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'sonner';
import type { z } from 'zod';

export const Route = createFileRoute('/(auth)/SignUp')({
  component: RouteComponent,
})

type SignUpFormData = z.infer<typeof signUpSchema>;

function RouteComponent() {
  const navigate = useNavigate();
  const signUp = useAuthStore((state) => state.signUp);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const user = await signUp(data);
      if (user?.success && user?.data?.statusCode === 201) {
        toast.success('Sign up successful!');
        navigate({ to: '/' });
      } else {
        toast.info('Please verify your email');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Sign up failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow bg-background">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
            Sign Up
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 transition-all duration-200"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="text-xl" />
            <span className="font-medium">Sign up with Google</span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
