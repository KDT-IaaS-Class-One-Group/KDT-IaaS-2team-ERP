import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import Service from "@/components/dashboard/subscription/Service-b";

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