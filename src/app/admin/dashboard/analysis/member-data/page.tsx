import NavLinks from "@/components/dashboard/analysis/Data-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import MemberData from "@/components/dashboard/analysis/Meber-data-b";

export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <MemberData />
    </>
  );
}
