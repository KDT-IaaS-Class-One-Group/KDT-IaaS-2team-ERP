'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from "@/styles/navlink.module.scss";

const links = [
  { name: '정보관리', href: '/mypage/myinfo' },
  { name: '캐쉬관리', href: '/mypage/mycash' },
  { name: '구독관리', href: '/mypage/subscription' },
  { name: '회원탈퇴', href: '/mypage/withdrawal' }
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={clsx(
            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3',
            {
              'bg-sky-100 text-blue-600': pathname === link.href,
              'text-white': true,
            },
          )}
        >
          <p className={styles.linkname}>{link.name}</p>
        </Link>
      ))}
    </>
  );
}