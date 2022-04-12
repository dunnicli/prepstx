import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>STX Prep App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="text-4xl font-black">STX Prep</h1>
        <Link href="/ingress"> Sign In.</Link>
        <p>&nbsp;</p>
        <p>
          <Link href="/nft/createNftV2"> Create V3 NFT</Link>
        </p>
        <p>&nbsp;</p>
        <p>
          <Link href="/nft/apiV2read"> API V3 NFT</Link>
        </p>
        <p>&nbsp;</p>
        <p>&nbsp;</p>
        <p>
          <Link href="/nft/createNft"> Create NFT</Link>
        </p>
        <p>&nbsp;</p>
        <p>
          <Link href="/nft/readDetails"> API Code Tests</Link>
        </p>
      </main>

      <footer className={styles.footer}>Powered BY: JTD</footer>
    </div>
  );
}
