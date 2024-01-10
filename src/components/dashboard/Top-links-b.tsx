'use client';

import Link from 'next/link';
import styles from '@/styles/admintoplink.module.scss'

const links = [
  { name: '회원관리', href: '/admin/dashboard/user/user-info' },
  { name: '구독관리', href: '/admin/dashboard/subscription/service' },
  { name: '통계분석', href: '/admin/dashboard/analysis/user-data' },
  { name: '고객지원', href: '/admin/dashboard/service'}
];

export default function TopNavLinks() {

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={styles.link}
        >
          <p className={styles.linkName}>{link.name}</p>
        </Link>
      ))}
    </>
  );
}