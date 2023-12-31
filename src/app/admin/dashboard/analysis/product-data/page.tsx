import NavLinks from "@/components/dashboard/analysis/Data-nav-links-b";
import styles from "@/styles/adminsidenav.module.scss";
import ProductData from "@/components/dashboard/analysis/Product-data-b";

export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <ProductData />
    </>
  );
}
