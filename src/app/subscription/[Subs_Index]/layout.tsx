import styles from "@/styles/subscription.module.scss"
import Topbar from "@/components/Topbar/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.main}>
      <div className={styles.topbar} ><Topbar/></div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}