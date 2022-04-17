import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import fetch from "cross-fetch";
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
} from "@stacks/blockchain-api-client";
import {
  intCV,
  uintCV,
  cvToHex,
  stringAsciiCV,
  deserializeCV,
  cvToString,
  hexToCV,
} from "@stacks/transactions";

export default function ApiCode() {
  const [theUri, setTheUri] = useState("");
  const [theTid, setTheTid] = useState();
  const [theLatest, setTheLatest] = useState(0);
  const [theJson, setTheJson] = useState("");

  const handleTheTidChange = (e) => {
    setTheTid(e.target.value);
  };

  const getLatest = async (e) => {
    e.preventDefault();
    const apiConfig = new Configuration({
      fetchApi: fetch,
      // for mainnet, replace `testnet` with `mainnet`
      basePath: "https://stacks-node-api.testnet.stacks.co", // defaults to http://localhost:3999
      //basePath: "http://localhost:3999",
    });

    // initiate the /accounts API with the basepath and fetch library
    const accountsApi = new AccountsApi(apiConfig);
    const smartContractsApi = new SmartContractsApi(apiConfig);

    const txs = await accountsApi.getAccountAssets({
      principal: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
      //principal: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
    });
    console.log(txs);

    const turi = await smartContractsApi.callReadOnlyFunction({
      contractAddress: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
      contractName: "acat-v3-nft",
      functionName: "get-last-token-id",
      readOnlyFunctionArgs: {
        sender: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
        arguments: [],
      },
    });
    let cv = hexToCV(turi.result);
    let cv2 = cvToString(cv);
    setTheLatest(cv2);
    console.log("Latest", cv2);
  };

  const getInfo = async (e) => {
    e.preventDefault();
    const apiConfig = new Configuration({
      fetchApi: fetch,
      // for mainnet, replace `testnet` with `mainnet`
      basePath: "https://stacks-node-api.testnet.stacks.co", // defaults to http://localhost:3999
      //basePath: "http://localhost:3999",
    });

    // initiate the /accounts API with the basepath and fetch library
    const accountsApi = new AccountsApi(apiConfig);
    const smartContractsApi = new SmartContractsApi(apiConfig);

    // get transactions for a specific account
    const txs = await accountsApi.getAccountAssets({
      principal: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
      //principal: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
    });
    console.log(txs);

    const turi = await smartContractsApi.callReadOnlyFunction({
      contractAddress: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
      contractName: "acat-v3-nft",
      functionName: "get-metaUri",
      readOnlyFunctionArgs: {
        sender: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
        arguments: [cvToHex(uintCV(theTid))],
      },
    });
    const resultCV = deserializeCV(turi.result);
    console.log(JSON.stringify(resultCV));

    const resultUrl = resultCV.value.data;
    const response = await fetch(resultUrl);

    if (!response.ok) throw new Error(response.statusText);

    const json = await response.json();
    setTheUri(resultCV.value.data);
    setTheJson(json);
    console.log("Meta URI:", resultCV.value.data);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>** V3 NFT API Code Tests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col w-full items-center justify-center">
          <h1 className="text-6xl font-bold mb-10">V3 NFT API Code Tests</h1>
          <p>
            <Link href="/"> Home</Link>
          </p>
          <p>&nbsp;</p>
          <form onSubmit={getInfo}>
            <p>
              Token ID
              <br />
              <input
                className="p-6 border rounded mx-2"
                type="number"
                required={true}
                value={theTid}
                onChange={handleTheTidChange}
                placeholder="Token ID"
              />
            </p>
            <p>&nbsp;</p>
            <button
              type="submit"
              className="bg-white-500 mb-6 rounded border-2 border-black py-2 px-4 font-bold hover:bg-gray-300"
            >
              Get Info
            </button>
          </form>
          <h1>
            Metadata URI:{" "}
            <a href={`${theUri}`} target="_blank" rel="noopener noreferrer">
              {theUri}
            </a>
          </h1>

          <h1>Token ID: {theTid}</h1>
          <h1>Name: {theJson.name}</h1>
          <h1>Description: {theJson.description}</h1>
          <p>&nbsp;</p>
          <div className="border shadow rounded-xl overflow-hidden">
            <a
              target="_blank"
              href={`${theJson.image}`}
              alt="Open image in a new tab"
              title="Open image in a new tab"
              rel="noopener noreferrer"
            >
              <img src={theJson.image} className="rounded" />
            </a>
            <div className="p-4 bg-black">
              <p className="text-2xl font-bold text-white">
                Description - {theJson.description}
              </p>
            </div>
          </div>

          <p>&nbsp;</p>
          <button
            onClick={getLatest}
            className="bg-white-500 mb-6 rounded border-2 border-black py-2 px-4 font-bold hover:bg-gray-300"
          >
            Get Last Token ID
          </button>
          <h1>Lastest Token ID: {theLatest}</h1>
          <hr />
        </div>
      </main>
    </div>
  );
}
