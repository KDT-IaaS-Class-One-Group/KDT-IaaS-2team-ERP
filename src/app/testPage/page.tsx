import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Link href="/testPage/writingPage">
        <button>글쓰기</button>
      </Link>
    </div>
  );
}
