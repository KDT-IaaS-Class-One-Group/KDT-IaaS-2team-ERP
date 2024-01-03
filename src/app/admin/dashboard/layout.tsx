import styles from "@/styles/dashboard.module.scss";
import Topbar from "@/components/dashboard/Topbar-b";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.main}>
      <div>
        <Topbar />
      </div>
      <div className={styles.side}></div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
