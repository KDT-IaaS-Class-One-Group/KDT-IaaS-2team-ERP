
import React from 'react';
import styles from "@/styles/index.module.scss";
import Topbar from "@/components/Topbar/Topbar";


function Index() {
  
  return (
    <div className={styles.container}>
      <Topbar />
      <div className={`${styles.div} ${styles.gray}`}>

        </div>
      <div className={`${styles.div} ${styles.blue}`} />
      <div className={`${styles.div} ${styles.yellow}`} />
      <div className={`${styles.div} ${styles.purple}`} />
    </div>
  );
}

export default Index;