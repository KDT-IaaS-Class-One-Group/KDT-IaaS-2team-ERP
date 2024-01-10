"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/adminnavlink.module.scss";

const links = [
  { name: "구독 서비스 관리", href: "/admin/dashboard/subscription/service" },
  { name: "구독 상품 관리", href: "/admin/dashboard/subscription/sub-product" },
  { name: "상품 관리", href: "/admin/dashboard/subscription/product" },
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
