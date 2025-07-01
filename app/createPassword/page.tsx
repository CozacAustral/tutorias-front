'use client';

import CreatePassword from './CreatePassword';
import { useSearchParams } from 'next/navigation';

type PageProps = {
  params: {
      token: string
  }
}

const Page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? ''
  const linkId = searchParams.get('linkId') ?? ''

  console.log('token:', token);
  console.log('linkId:', linkId);

  return <CreatePassword token={token} linkId={linkId}/>
}

export default Page;