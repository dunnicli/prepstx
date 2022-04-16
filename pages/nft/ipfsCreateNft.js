// ipfs nft create

import { useState, useEffect } from "react";
import { create } from "ipfs-http-client";
import { useRouter } from "next/router";
import Link from "next/link";
import Router from "next/router";
//import { toast, ToastContainer } from "react-nextjs-toast";
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
  stringAsciiCV,
  standardPrincipalCV,
} from "@stacks/transactions";
//import useInterval from "@use-it/interval";
import { StacksMocknet, StacksTestnet } from "@stacks/network";

const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECTID;
const projectSecret = process.env.NEXT_PUBLIC_IPFS_PROJECTSECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

//

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const router = useRouter();
  const appConfig = new AppConfig(["publish_data"]);
  const userSession = new UserSession({ appConfig });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  //const [metadataUri, setMetadataUri] = useState("");
  //const [nftRecipient, setNftRecipient] = useState("");

  // Set up the network and API
  const network = new StacksTestnet();
  //const network = new StacksMocknet();

  const [formInput, updateFormInput] = useState({
    name: "",
    description: "",
    recipient: "",
  });

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function createNft() {
    //toast.notify(`Hi, I am a toast!`);

    // Upload the file to IPFS

    const { name, description } = formInput;
    if (!name || !description || !fileUrl) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      //const description = data.description;
      /* after file is uploaded to IPFS, pass the URL to save it on Polygon */
      createStxSale(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  // End of upload to IPFS

  // Connect MetaMask

  async function createStxSale(url) {
    /* next, create the item */
    const clarityRecipient = standardPrincipalCV(formInput.recipient);
    const clarityUri = stringAsciiCV(url);
    //Testnet Contract
    const assetAddress = "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9";
    //Mocknet Contract
    //const assetAddress = "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS";

    //const uri = stringAsciiCV(metadataUri);
    const functionArgs = [
      clarityRecipient,
      clarityUri,
      // form input goes here...
    ];
    const postConditionAddress =
      userSession.loadUserData().profile.stxAddress.testnet;
    const nftPostConditionCode = NonFungibleConditionCode.Owns;
    const assetContractName = "acat-v3-nft";
    const assetName = "acat";
    const tokenAssetName = stringAsciiCV("acat");
    const nonFungibleAssetInfo = createAssetInfo(
      assetAddress,
      assetContractName,
      assetName
    );

    const stxConditionCode = FungibleConditionCode.LessEqual;
    const stxConditionAmount = 100000000; // denoted in microstacks

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
      contractName: "acat-v3-nft",
      functionName: "mint",
      functionArgs,
      network,
      postConditions,
      appDetails: {
        name: "Acat V3",
        icon: "https://assets.website-files.com/618b0aafa4afde65f2fe38fe/618b0aafa4afde2ae1fe3a1f_icon-isotipo.svg",
      },
      onFinish: (data) => {
        console.log(data);
      },
    };

    await openContractCall(options);
  }

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

  // End of create the item

  return (
    <div className="flex p-4">
      <Head>
        <title>IPFS Create STX NFT</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-1/2 flex flex-col pb-12">
        <p>&nbsp;</p>
        <p>
          <Link href="/">Home</Link>
        </p>
        <p className="px-20 py-10 text-3xl font-black">Create New STX NFT</p>
        <input
          placeholder="NFT Name - Title"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <input
          placeholder="Recipient Address"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, recipient: e.target.value })
          }
        />
        <textarea
          placeholder="NFT Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />

        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && (
          <img
            alt="file to upload"
            className="rounded mt-4"
            width="350"
            src={fileUrl}
          />
        )}

        <p>&nbsp;</p>

        <br />
        <button
          onClick={createNft}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Stx NFT
        </button>
        <p>&nbsp;</p>
        {!loggedIn && (
          <button
            className="bg-white-500 hover:bg-gray-300 border-black border-2 font-bold py-2 px-4 rounded mb-6"
            onClick={() => authenticate()}
          >
            Connect to Wallet
          </button>
        )}
      </div>
    </div>
  );
}
