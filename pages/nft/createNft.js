import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import {
  NonFungibleConditionCode,
  FungibleConditionCode,
  createAssetInfo,
  makeStandardNonFungiblePostCondition,
  makeStandardSTXPostCondition,
  bufferCVFromString,
  standardPrincipalCV,
} from "@stacks/transactions";
import {
  uintCV,
  stringUtf8CV,
  hexToCV,
  cvToHex,
  callReadOnlyFunction,
} from "@stacks/transactions";
import useInterval from "@use-it/interval";
import { StacksMocknet, StacksTestnet } from "@stacks/network";

export default function Home() {
  const appConfig = new AppConfig(["publish_data"]);
  const userSession = new UserSession({ appConfig });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  // Set up the network and API
  const network = new StacksTestnet();

  // mint token

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Testnet Contract
    const assetAddress = "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9";
    //Mocknet Contract
    //const assetAddress = "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS";

    const functionArgs = [
      standardPrincipalCV(
        userSession.loadUserData().profile.stxAddress.testnet
      ),
    ];
    const postConditionAddress =
      userSession.loadUserData().profile.stxAddress.testnet;
    const nftPostConditionCode = NonFungibleConditionCode.Owns;
    const assetContractName = "acat-nft";
    const assetName = "acat";
    const tokenAssetName = bufferCVFromString("acat");
    const nonFungibleAssetInfo = createAssetInfo(
      assetAddress,
      assetContractName,
      assetName
    );

    const stxConditionCode = FungibleConditionCode.LessEqual;
    const stxConditionAmount = 50000000; // denoted in microstacks

    const postConditions = [
      makeStandardNonFungiblePostCondition(
        postConditionAddress,
        nftPostConditionCode,
        nonFungibleAssetInfo,
        tokenAssetName
      ),
      makeStandardSTXPostCondition(
        postConditionAddress,
        stxConditionCode,
        stxConditionAmount
      ),
    ];
    const options = {
      contractAddress: assetAddress,
      contractName: "acat-nft",
      functionName: "mint",
      functionArgs,
      network,
      postConditions,
      appDetails: {
        name: "Acat",
        icon: "https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde2ae1fe3a1f_icon-isotipo.svg",
      },
      onFinish: (data) => {
        console.log(data);
      },
    };

    await openContractCall(options);
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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Create NFT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col w-full items-center justify-center">
          <h1 className="text-6xl font-bold mb-10">Create NFT</h1>
          <p>
            <Link href="/"> Home</Link>
          </p>
          <p>&nbsp;</p>

          {loggedIn ? (
            <>
              <form onSubmit={handleSubmit}>
                <p>
                  <p>&nbsp;</p>
                  Token JSON URI
                  <br />
                  <input
                    className="p-6 border rounded mx-2"
                    type="text"
                    value=""
                  />{" "}
                </p>
                <p>&nbsp;</p>
                <button
                  type="submit"
                  className="p-6 bg-green-500 text-white mt-8 rounded"
                >
                  Create NFT Now
                </button>
              </form>
              <p>&nbsp;</p>
            </>
          ) : (
            <button
              className="bg-white-500 hover:bg-gray-300 border-black border-2 font-bold py-2 px-4 rounded mb-6"
              onClick={() => authenticate()}
            >
              Connect to Wallet
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
