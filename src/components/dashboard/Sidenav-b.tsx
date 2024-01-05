import Link from 'next/link';
import NavLinks from '@/components/dashboard/user/User-nav-links-b'
import styles from "@/styles/adminsidenav.module.scss"

export default function SideNav() {
  return (
    <div className={styles.sidemenu}>
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          
        </div>
      </Link>
      <div className={styles.sidelink}>
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        
      </div>
    </div>
  );
}
