import Image from 'next/image';
import MobileNav from '../../components/MobileNav';
import Sidebar from '../../components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = { firstName: 'Dom', lastName: 'Wingfield' };

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn} />

      <div className="flex size-full flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="Menu icon" />
          <div>
            <MobileNav user={loggedIn} />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
