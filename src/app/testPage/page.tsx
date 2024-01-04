import React from "react";
import Link from "next/link";

export default async function App() {
  return (
    <div id="root">
      <p></p>
      <Link href="/testPage/writingPage">
        <button>Go to Writing Page</button>
      </Link>
    </div>
  );
}
