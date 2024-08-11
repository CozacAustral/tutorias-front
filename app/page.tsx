import { redirect } from 'next/navigation';

export default function Page() {
  const isAuthenticated = true; 

  if (!isAuthenticated) {
    redirect('/Login');
  }

  return <div>Bienvenido al Dashboard</div>;
}
