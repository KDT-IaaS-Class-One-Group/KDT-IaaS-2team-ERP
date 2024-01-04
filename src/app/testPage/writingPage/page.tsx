import React from 'react'
import Link from "next/link";

export default function Page() {
  return (
  <div id='root'>
  <label htmlFor="">제목</label>
  <input type="text" />
  <label htmlFor="">내용</label>
  <textarea></textarea>
  <Link href="/testPage">
  <button>글 등록</button>
  </Link>
  </div>
  )
}