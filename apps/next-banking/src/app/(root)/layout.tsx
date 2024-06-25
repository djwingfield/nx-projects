import Sidebar from '../../components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = { firstName: 'Dom', lastName: 'Wingfield' };

  return (
    <main className="flex h-screen w-full font-inter">
      <Sidebar user={loggedIn}></Sidebar>
      {children}
    </main>
  );
}
