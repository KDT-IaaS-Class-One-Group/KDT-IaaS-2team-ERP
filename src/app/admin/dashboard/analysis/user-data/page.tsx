import NavLinks from "@/components/dashboard/analysis/Data-nav-links-b";
import styles from "@/styles/adminuser.module.scss";
import UserData from "@/components/dashboard/analysis/User-data-b";
import UserGraph from "@/components/dashboard/analysis/UserGraph";

export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <UserData />
      <UserGraph />
    </>
  );
}
