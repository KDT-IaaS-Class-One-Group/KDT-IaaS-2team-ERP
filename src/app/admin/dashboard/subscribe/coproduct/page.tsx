import NavLinks from "@/components/dashboard/subscribe/Subscribe-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import Service from "@/components/dashboard/subscribe/Service-b";

export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <Service />
    </>
  );
}