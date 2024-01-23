import NavLinks from '@/components/mypage/nav-links'
import styles from "@/styles/sidenav.module.scss"

export default function SideNav() {

  return (
    <div className={styles.sidemenu}>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
    </div>
  );
}
