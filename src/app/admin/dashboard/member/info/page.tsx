import NavLinks from "@/components/dashboard/member/Member-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import Info from "@/components/dashboard/member/Info-b";

export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <Info />
    </>
  );
}
