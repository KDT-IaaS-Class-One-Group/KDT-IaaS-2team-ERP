import Link from 'next/link';
import NavLinks from '@/components/mypage/nav-links'
import { usePathname } from 'next/navigation';
import styles from "@/styles/sidenav.module.scss"


const links = [
  { name: '정보관리', href: '/mypage/myinfo' },
  { name: '캐쉬관리', href: '/mypage/mycash' },
  { name: '구독관리', href: '/mypage/subscription' },
];


export default function SideNav() {

  return (
    <div className={styles.sidemenu}>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
    </div>
  );
}
