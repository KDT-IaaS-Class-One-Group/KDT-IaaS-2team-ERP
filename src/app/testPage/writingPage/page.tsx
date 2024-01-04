"use client";
import React from "react";
import styles from "@/styles/test.module.scss";
import Link from "next/link";

export default function Page() {
  return (
    <div className={styles.root}>
      <div>
        <label htmlFor="title">
          제목
        </label>
        <input type="text" id="title" className={`${styles.width} ${styles.margin}`} />
      </div>
      <div>
        <label htmlFor="contents">내용</label>
        <textarea id="contents" className={`${styles.width} ${styles.height}`}></textarea>
      </div>
      <Link href="/testPage">
        <button>Go back to Test Page</button>
      </Link>
    </div>
  );
}
