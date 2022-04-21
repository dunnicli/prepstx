import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import {
  intCV,
  uintCV,
  standardPrincipalCV,
  makeStandardSTXPostCondition,
  cvToHex,
  deserializeCV,
} from "@stacks/transactions";
import {
  AppConfig,
  UserSession,
  showConnect,
  openContractCall,
} from "@stacks/connect";
import { StacksMocknet } from "@stacks/network";

export default function AddMinter() {
  const appConfig = new AppConfig(["publish_data"]);
  const userSession = new UserSession({ appConfig });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);

  // Set up the network
  const network = new StacksMocknet();
  const formRef = useRef();

  /**
  const formRef = useRef();
  //const [theUri, setTheUri] = useState("");
  const { editMinter, editAmount } = formRef.current;
  const minter = editMinter.value;
  const amount = editAmount.value;

  //
  let formData = {
    minter,
    amount,
  };
 */

  const handleSubmit = async (e) => {
    e.preventDefault();
    //const [theUri, setTheUri] = useState("");
    const { editMinter, editAmount } = formRef.current;
    const minter = editMinter.value;
    const amount = editAmount.value;

    //
    let formData = {
      minter,
      amount,
    };
    const contractAddress = "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS";

    const functionArgs = [
      standardPrincipalCV(formData.minter),
      uintCV(formData.amount),
    ];

    const postConditionAddress =
      userSession.loadUserData().profile.stxAddress.testnet;
    //const postConditionCode = FungibleConditionCode.LessEqual;
    //const postConditionAmount = amount * 1000000;
    const postConditions = [makeStandardSTXPostCondition(postConditionAddress)];

    const options = {
      contractAddress: contractAddress,
      contractName: "acatv4",
      functionName: "add-recipient",
      functionArgs,
      network,
      postConditions,
      appDetails: {
        name: "acatv4",
        icon: window.location.origin + "/vercel.svg",
      },
      onFinish: (data) => {
        console.log("Stacks Transaction:", data.stacksTransaction);
        console.log("Transaction ID:", data.txId);
        console.log("Raw transaction:", data.txRaw);
      },
    };

    await openContractCall(options);
  };

  function authenticate() {
    showConnect({
      appDetails: {
        name: "Acat V3",
        icon: "",
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

  // Get token uri

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Add Approved Minter</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col w-full items-center justify-center">
          <h1 className="text-6xl font-bold mb-10">Add Approved Minter</h1>
          <p>
            <Link href="/"> Home</Link>
          </p>
          <p>&nbsp;</p>
          {loggedIn ? (
            <form
              ref={formRef}
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <p>
                <b>Minter STX Address</b>
                <br />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Minters STX Address"
                  defaultValue=""
                  name="editMinter"
                  required
                />
              </p>
              <p>&nbsp;</p>
              <p>
                <b>Amount - i.e. 1</b>
                <br />
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="text"
                  placeholder="Numerical Amount"
                  name="editAmount"
                  defaultValue=""
                  required
                />
              </p>
              <p>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  disabled=""
                  onClick={() => handleSubmit()}
                >
                  Add New Minter
                </button>
              </p>
            </form>
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
