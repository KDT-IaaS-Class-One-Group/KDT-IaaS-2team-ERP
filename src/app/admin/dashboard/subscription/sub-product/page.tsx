import NavLinks from "@/components/dashboard/subscription/Subscription-nav-links-b";
import styles from "@/styles/adminuser.module.scss";
import SubsProduct from "@/components/dashboard/subscription/Subs-product-b";


export default async function Page() {
  return (
    <>
      <div className={styles.sidelink}>
        <NavLinks />
      </div>
      <main>
      <SubsProduct />
      </main>
    </>
  );
}