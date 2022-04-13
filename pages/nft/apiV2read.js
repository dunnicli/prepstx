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
} from "@stacks/transactions";

export default function ApiCode() {
  const [theUri, setTheUri] = useState("");
  const [theTid, setTheTid] = useState(0);

  const handleTheTidChange = (e) => {
    setTheTid(e.target.value);
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
      //const clarityTid = uintCV(tid);
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
    setTheUri(resultCV.value.data);
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
          <h1>Metadata URI: {theUri}</h1>
          <h1>Token ID: {theTid}</h1>
        </div>
      </main>
    </div>
  );
}
