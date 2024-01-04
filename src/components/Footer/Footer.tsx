import React from "react";
import styles from "@/styles/footer.module.scss";


export default function Footbar() {
  

  return (
    <div className={styles.footbar}>
      <div className={styles.footdiv1}>NTS</div>
      <div className={styles.footdiv2}>
        <div className={styles.suvdiv1}>카약</div>
        <div className={styles.suvdiv2}>
          <p>이용약관 l 개인정보처리방침 l 카약 공식 블로그 l 전국 검사소 목록</p>
          <p>대표이사 : 변무영</p>
          <p>사업자 등록번호 : 338-88-00960</p>
          <p>고객센터 : 070-7714-7734</p>
          <p>팩스 : +82-02-6190-4211</p>
          <p>본사 : 대전광역시 유성구 대학로 179번길 7-12, 디3동 204호</p>
          <p>ⓒ 2023 MK. All rights reserved</p>
        </div>
      </div>
      <div className={styles.footdiv3}>
        <div className={styles.suvdiv3}>
        <p>카약은 통신판매중개자로서 입점 업체가 제공하는</p>
        <p>상품/서비스에 대한 거래 정보 및 거래와 관련하여 일체 책임을 지지 않습니다.</p>
        </div>
        <div className={styles.suvdiv4}></div>
      </div>
    </div>
  );
}


