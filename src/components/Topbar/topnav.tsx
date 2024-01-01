
import TopNavLinks from '@/components/Topbar/top-links'
import styles from "@/styles/topnav.module.scss"

export default function TopNav() {
  return (
    <div className={styles.topmenu}>
      <div className={styles.toplink}>
        <TopNavLinks />
      
      </div>
    </div>
  );
}
