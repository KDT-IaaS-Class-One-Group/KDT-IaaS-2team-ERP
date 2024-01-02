import Topbar from "@/components/Topbar/Topbar";
import styles from "@/styles/info.module.scss"

export default async function Page() {
  return (
    <div className={styles.root}>
      <Topbar />
      <div className={styles.main}>
        회사정보
      </div>
    </div>
  );
}