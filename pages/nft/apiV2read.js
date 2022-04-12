import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import fetch from "cross-fetch";
import {
  Configuration,
  AccountsApi,
  SmartContractsApi,
  //parseReadOnlyResponse,
  //CallReadOnlyFunctionRequest,
} from "@stacks/blockchain-api-client";
import { intCV, uintCV, cvToHex, deserializeCV } from "@stacks/transactions";

export default function ApiCode() {
  const [theUri, setTheUri] = useState("");
  const getInfo = async () => {
    //const [theUri, setTheUri] = useState("");
    const apiConfig = new Configuration({
      fetchApi: fetch,
      // for mainnet, replace `testnet` with `mainnet`
      //basePath: "https://stacks-node-api.testnet.stacks.co", // defaults to http://localhost:3999
      basePath: "http://localhost:3999",
    });

    // initiate the /accounts API with the basepath and fetch library
    const accountsApi = new AccountsApi(apiConfig);
    const smartContractsApi = new SmartContractsApi(apiConfig);

    // get transactions for a specific account
    const txs = await accountsApi.getAccountAssets({
      //const txs = await accountsApi.getAccountTransactions({
      //principal: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
      principal: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
    });
    console.log(txs);

    //const ReadOnlyFunctionArgs
    const tid = uintCV(1);
    const turi = await smartContractsApi.callReadOnlyFunction({
      contractAddress: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
      contractName: "acatv4",
      functionName: "get-token-uri",
      //functionArgs: [tid],
      //readOnlyFunctionArgs: [cvToHex(uintCV(1))],
      //readOnlyFunctionArgs: [uintCV(1)],
      readOnlyFunctionArgs: {
        sender: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
        arguments: [cvToHex(uintCV(1))],
      },
    });
    const resultCV = deserializeCV(turi.result);
    console.log(JSON.stringify(resultCV));
    //const myuri = JSON.stringify(resultCV.value);
    setTheUri(resultCV.value.value.data);
    console.log("Token URI:", resultCV.value.value.data);
    //console.log(JSON.stringify(resultCV.value));
    // You can parse the resultCV to get the result of the function call
    //console.log(resultCV.data);
  };

  // Get token uri
  /**
   export interface CallReadOnlyFunctionRequest {
    contractAddress: string;
    contractName: string;
    functionName: string;
    readOnlyFunctionArgs: ReadOnlyFunctionArgs;
    tip?: string;
} 
   */

  // Get info
  // https://stacks-node-api.testnet.stacks.co/
  // `http://localhost:3999/stacks-api/${assetAddress}.get-info`
  // https://stacks-node-api.testnet.stacks.co/extended/v1/address/{principal}/balances
  // `https://stacks-node-api.testnet.stacks.co/${assetAddress}.get-info`,

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>V4 NFT API Code Tests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col w-full items-center justify-center">
          <h1 className="text-6xl font-bold mb-10">V4 NFT API Code Tests</h1>
          <p>
            <Link href="/"> Home</Link>
          </p>
          <p>&nbsp;</p>
          <button
            className="bg-white-500 mb-6 rounded border-2 border-black py-2 px-4 font-bold hover:bg-gray-300"
            onClick={() => getInfo()}
          >
            Get Info
          </button>
          <h1>Token URI: {theUri}</h1>
        </div>
      </main>
    </div>
  );
}
