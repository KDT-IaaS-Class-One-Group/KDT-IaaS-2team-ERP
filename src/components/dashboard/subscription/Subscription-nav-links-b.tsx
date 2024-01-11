"use client";

import Link from "next/link";
import styles from "@/styles/adminnavlink.module.scss";

const links = [
  { name: "구독 내역", href: "/admin/dashboard/subscription/order" },
  { name: "구독 관리", href: "/admin/dashboard/subscription/sub-product" },
  { name: "상품 관리", href: "/admin/dashboard/subscription/product" },
];

export default function NavLinks() {

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
