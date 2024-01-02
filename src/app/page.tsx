
import React from 'react';
import styles from "@/styles/index.module.scss";
import Topbar from "@/components/Topbar/Topbar";


function Index() {
  
  return (
    <div className={styles.container}>
      <Topbar />
      <div className={`${styles.div} ${styles.gray}`}>
      <div className={styles.box}>kjawjoiewjifojwajfoiaiou</div>
      </div>
      <div className={`${styles.div} ${styles.blue}`} >안녕하세요</div>
      <div className={`${styles.div} ${styles.yellow}`} />
      <div className={`${styles.div} ${styles.purple}`} />
    </div>
  );
}

export default Index;