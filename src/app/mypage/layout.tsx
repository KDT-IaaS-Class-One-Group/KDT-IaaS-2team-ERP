import SideNav from '@/components/mypage/sidenav';
import styles from "@/styles/mypage.module.scss";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.main}>
      <div className={styles.side}>
        <SideNav />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}