import NavLinks from "@/components/dashboard/subscribe/Subscribe-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import Product from "@/components/dashboard/subscribe/Product-b";

export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <Product />
    </>
  );
}