'use client';

import CreatePassword from './reset-password';
import { useSearchParams } from 'next/navigation';

const Page = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? ''
  const linkId = searchParams.get('linkId') ?? ''

  return <CreatePassword token={token} linkId={linkId}/>
}

export default Page;