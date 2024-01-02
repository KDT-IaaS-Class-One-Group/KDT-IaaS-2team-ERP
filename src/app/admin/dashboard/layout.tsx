import SideNav from '@/components/dashboard/sidenav';
import styles from "@/styles/mypage.module.scss";
import Topbar from "@/components/dashboard/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.main}>
      <div><Topbar /></div>
      <div className={styles.side}>
        <SideNav />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}