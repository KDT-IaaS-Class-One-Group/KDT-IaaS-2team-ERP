import Topbar from "@/components/Topbar/Topbar";
import styles from "@/styles/subproduct.module.scss"

export default async function Page() {
  return (
    <div className={styles.root}>
      <div className={styles.top}><Topbar /></div>
      <div className={styles.main}>
       구독 상품들 
      </div>
    </div>
  );
}
