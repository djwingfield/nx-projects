import type { Metadata } from 'next';
import { IBM_Plex_Serif, Inter } from 'next/font/google';
import './global.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-ibm-',
});

export const metadata: Metadata = {
  title: 'Wing Bank',
  description: 'Wing Bank is a modern banking platform for everyone.',
  icons: {
    icon: '../../public/icons/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${ibmPlexSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
