import { useAuthStore } from '@/store/useAuthStore';
import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useEffect } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/(auth)/GoogleSuccess')({
  component: RouteComponent,
  validateSearch: (search) => {
    return {
      accessToken: String(search.accessToken ?? ''),
    };
  },
})

function RouteComponent() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/(auth)/GoogleSuccess' });
  const accessToken = search.accessToken;
  const setAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('auth', accessToken);
      setAuth()
        .then(() => {
          toast.success('Google Login Successful!');
          navigate({ to: '/panal' });
        })
        .catch(() => {
          toast.error('Failed to fetch user profile.');
          navigate({ to: '/Login' });
        });
    } else {
      toast.error('No access token found.');
      navigate({ to: '/Login' });
    }
  }, [accessToken]);

  return <div className="p-6 text-center">Logging you in with Google...</div>;
}
