import SideNav from '@/components/dashboard/side-nav';
import styles from '@/styles/dashboard.module.scss'
export default async function Page({ children }: { children: React.ReactNode }) {
  return (
      <div className={styles.main}>
      <div className={styles.side}>
        <SideNav />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}