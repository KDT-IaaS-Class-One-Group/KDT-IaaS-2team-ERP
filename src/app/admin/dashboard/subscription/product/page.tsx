import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";
import styles from "@/styles/adminsubscription.module.scss";
import Product from "@/components/dashboard/subscription/Product-b";

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