import Header from '@/components/Header';
import { TripGrid } from '@/components/panel/TripGrid';
import { useAuthStore } from '@/store/useAuthStore';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createFileRoute('/panal')({
  component: RouteComponent,
})

function RouteComponent() {

  const navigate = useNavigate();
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();

  }, [])

  useEffect(() => {
    if (!isCheckingAuth) {
      if (!authUser) {
        // console.log("Redirecting because user is null", authUser);
        navigate({ to: '/Login' });
      } else {
        // console.log("User authenticated:", authUser);
      }
    }
  }, [isCheckingAuth]);


  if (isCheckingAuth) {
    return <div className='text-white'>Checking authentication...</div>
  }

  return (
    <div>
      <Header />
      <div className='m-4'>
        <h2 className="text-2xl font-semibold mb-4">Your Trips</h2>
        <TripGrid />
      </div>
    </div>
  )
}
