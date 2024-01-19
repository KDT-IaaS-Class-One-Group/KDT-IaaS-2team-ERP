import styles from "@/styles/infobox.module.scss"
import Link from "next/link";
import Image from 'next/image';

export default function Aboutus() {
  return (
    <div className={styles.root}>
      <div className={styles.infobox}>
        <div className={styles.container}>
          <div className={styles.title}>About us</div>
          <div className={styles.info}>
            “We started in the coffee business in 1989 and the Havana train was off, whirling on the tracks. People say you don’t just taste our coffee you feel it” - Geoff Marsland, Coffee Baron

            Back in 1990 there were just four coffee companies roasting in New Zealand. The industry has since grown substantially and now there’s more than 400, but from the beginning, People say you don’t just taste our coffee you feel it” - Geoff Marsland, Coffee Baronwe’ve stayed true to our vibe and vision. Roasting the COFFEEUFEEL, having fun, being connected to community and celebrating the origins of coffee, plus drinking a heap of epic espresso!
          </div>
          <Link href={`/`}>
              <button>Read More</button>
          </Link>
        </div>
      </div>
      <div className={styles.imagebox}>
        <Image fill={true} src={`/image/일단소개.jpg`} alt={'일단소개'} />
      </div>
    </div>
  )}