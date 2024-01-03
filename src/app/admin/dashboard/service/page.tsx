import NavLinks from "@/components/dashboard/service/Service-nav-links-b"
import styles from "@/styles/adminsidenav.module.scss";
import QA from "@/components/dashboard/service/QA-b";

export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <QA />
    </>
  );
}
