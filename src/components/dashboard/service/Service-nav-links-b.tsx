"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import styles from "@/styles/adminnavlink.module.scss";

const links = [{ name: "Q&A", href: "/admin/dashboard/service" }];

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
