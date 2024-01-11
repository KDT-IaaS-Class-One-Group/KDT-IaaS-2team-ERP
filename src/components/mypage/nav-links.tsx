'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import styles from "@/styles/navlink.module.scss";

const links = [
  { name: '정보관리', href: '/mypage/myinfo' },
  { name: '캐쉬관리', href: '/mypage/mycash' },
  { name: '구독관리', href: '/mypage/subscription' },
];

export default function NavLinks() {
  const pathname = usePathname();
  console.log(pathname)
  return (
    <>
      {links.map((link) => (
        <Link
        key={link.name}
        href={link.href}
        className={`${styles.linkbox} ${pathname === link.href ? styles.activeLink : ''}`}
        >
          <p className={styles.linkname}>{link.name}</p>
        </Link>
      ))}
    </>
  );
}