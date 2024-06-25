'use client';

import { cn } from '@djwingfield/shadcn-util';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarLinks } from '../constants';

const Sidebar = ({ user }: SiderbarProps) => {
  const pathName = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer items-center gap-2">
          test
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Wing Bank logo"
            className="size-[24px] max-xl:size-14"
           />
          <h1 className="sidebar-logo">Wing Bank</h1>
        </Link>
        {sidebarLinks.map((link) => {
          const isActive =
            pathName === link.route || pathName.startsWith(`${link.route}/`);

          return (
            <Link
              href={link.route}
              key={link.label}
              className={cn('sidebar-link', {
                'bg-bank-gradient': isActive,
              })}
            >
              <div className="relative size-6">
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  fill
                  className={cn({ 'brightness-[3] invert-0': isActive })}
                 />
              </div>
              <p className={cn('sidebar-label', { '!text-white': isActive })}>
                {link.label}
              </p>
            </Link>
          );
        })}
        USER
      </nav>
      FOOTER
    </section>
  );
};

export default Sidebar;