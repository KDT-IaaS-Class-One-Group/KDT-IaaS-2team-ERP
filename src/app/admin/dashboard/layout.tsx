"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/styles/dashboard.module.scss";
import Topbar from "@/components/dashboard/Topbar-b";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    if (!storedToken) {
      router.push("/admin");
    }
  }, [router]);

  return (
    <div className={styles.main}>
      <div>
        <Topbar />
      </div>
      <div className={styles.side}></div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
