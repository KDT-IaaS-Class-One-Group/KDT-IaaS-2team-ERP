"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import styles from "@/styles/adminnavlink.module.scss";

const links = [
  { name: "회원정보조회", href: "/admin/dashboard/user/user-info" },
  { name: "회원캐시관리", href: "/admin/dashboard/user/user-cash" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => (
        <Link key={link.name} href={link.href} className={styles.linkname}>
          <p>{link.name}</p>
        </Link>
      ))}
    </>
  );
}
