import React from "react";
import styles from "@/styles/footer.module.scss";


export default function Footbar() {
  

  return (
    <div className={styles.footbar}>
      <div className={styles.footdiv2}>
        <div className={styles.suvdiv1}>NTS</div>
        <div className={styles.suvdiv2}>
          <p>이용약관  l  개인정보처리방침</p>
          <p>CEO : 그린</p>
          <p>H.P : 070-3232-3232</p>
          <p>FAX : +82-02-3232-3233</p>
          <p>ADDRESS : 대전광역시 서구 대덕대로</p>
          <p>ⓒ 2023 MK. All rights reserved</p>
        </div>
      </div>
      <div className={styles.footdiv3}>
        <div className={styles.suvdiv3}>
          <p>Copyright © Dobra palarnia kawy. Powered by Shopify, made in korea</p>
        </div>
        <div className={styles.suvdiv4}>
        <img className={styles.logo} src="https://img.freepik.com/free-vector/instagram-logo_1199-122.jpg?1&w=1060&t=st=1705577550~exp=1705578150~hmac=2b07ef4fd1df9dea1c1eba7fbfe6158271c8c26b6a21e95ffb1ca08eb95131a4" alt="instagram"></img>
        <img className={styles.logo} src="https://img.freepik.com/free-vector/instagram-logo_1199-122.jpg?1&w=1060&t=st=1705577550~exp=1705578150~hmac=2b07ef4fd1df9dea1c1eba7fbfe6158271c8c26b6a21e95ffb1ca08eb95131a4" alt="instagram"></img>
        </div>
      </div>
    </div>
  );
}


