import TopNavLinks from "@/components/dashboard/Top-links-b";
import styles from "@/styles/admintopnav.module.scss";

export default function TopNav() {
  return (
    <div className={styles.topmenu}>
      <div className={styles.toplink}>
        <TopNavLinks />
      </div>
    </div>
  );
}
