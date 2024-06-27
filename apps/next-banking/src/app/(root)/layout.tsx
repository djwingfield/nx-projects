'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import MobileNav from '../../components/MobileNav';
import Sidebar from '../../components/Sidebar';
import { signOut } from '../../lib/actions/user.actions';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const loggedIn = { firstName: 'Dom', lastName: 'Wingfield' };

  const onLogout = async () => {
    setIsLoading(true);

    try {
      await signOut();
      router.push('/sign-in');
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} onLogout={onLogout} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="Menu icon" />
          <div>
            <MobileNav user={loggedIn} onLogout={onLogout} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
