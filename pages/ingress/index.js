import Head from "next/head";
//import Image from "next/image";
import styles from "../../styles/Home.module.css";
import Link from "next/link";
import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { useState, useEffect } from "react";

export default function SignIn() {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });
  const [userData, setUserData] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    userSession.signUserOut(),
      setUserData({}),
      setLoggedIn(false),
      setError(""); // clear error};
  };

  function authenticate() {
    showConnect({
      appDetails: {
        name: "Sup",
        icon: "https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde2ae1fe3a1f_icon-isotipo.svg",
      },
      redirectTo: "/",
      onFinish: () => {
        window.location.reload();
      },
      userSession,
    });
  }

  useEffect(() => {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        setUserData(userData);
      });
    } else if (userSession.isUserSignedIn()) {
      setLoggedIn(true);
      setUserData(userSession.loadUserData());
    }
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Sign In - STX</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className="text-4xl font-black">Sign In - STX</h1>
        <Link href="/"> Home</Link>
        <p>&nbsp;</p>
        {!loggedIn && (
          <button
            className="bg-white-500 mb-6 rounded border-2 border-black py-2 px-4 font-bold hover:bg-gray-300"
            onClick={() => authenticate()}
          >
            Connect to Wallet
          </button>
        )}
        <p>&nbsp;</p>
        {loggedIn && (
          <button
            className="bg-white-500 mb-6 rounded border-2 border-black py-2 px-4 font-bold hover:bg-gray-300"
            onClick={() => signOut()}
          >
            Disconnect Wallet
          </button>
        )}
        <p>&nbsp;</p>
        Session User Data: {JSON.stringify(userSession.isUserSignedIn())}
        <p>&nbsp;</p>
        {loggedIn && (
          <p>STX User ADDRESS: {userData.profile.stxAddress.testnet}</p>
        )}
      </main>

      <footer className={styles.footer}>Powered BY: JTD</footer>
    </div>
  );
}
