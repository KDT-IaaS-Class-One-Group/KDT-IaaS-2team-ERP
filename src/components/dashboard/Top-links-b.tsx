'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: '회원관리', href: '/admin/dashboard/member/info' },
  { name: '구독상품관리', href: '/admin/dashboard/subscribe/service' },
  { name: '통계분석', href: '/admin/dashboard/analysis/member-data' },
  { name: '고객지원', href: '/admin/dashboard/service'}
];

export default function TopNavLinks() {
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
          <p className="linkname">{link.name}</p>
        </Link>
      ))}
    </>
  );
}