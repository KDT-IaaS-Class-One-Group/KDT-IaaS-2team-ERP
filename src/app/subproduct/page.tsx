import Topbar from "@/components/Topbar/Topbar";
import styles from "@/styles/subproduct.module.scss"

export default async function Page() {
  return (
    <div className={styles.root}>
      <Topbar />
      <div className={styles.main}>
       구독 상품들 
      </div>
    </div>
  );
}
