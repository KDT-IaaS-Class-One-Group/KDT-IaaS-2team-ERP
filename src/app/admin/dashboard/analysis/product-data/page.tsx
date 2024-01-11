import NavLinks from "@/components/dashboard/analysis/Data-nav-links-b";
import styles from "@/styles/adminuser.module.scss";
import ProductData from "@/components/dashboard/analysis/Product-data-b";
import ProductGraph from "@/components/admin/ProductGraph";

export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <ProductData />
      <ProductGraph />
    </>
  );
}
