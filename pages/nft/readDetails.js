import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import fetch from "cross-fetch";
import { Configuration, AccountsApi } from "@stacks/blockchain-api-client";

export default function ApiCode() {
  const getInfo = async () => {
    const apiConfig = new Configuration({
      fetchApi: fetch,
      // for mainnet, replace `testnet` with `mainnet`
      basePath: "https://stacks-node-api.testnet.stacks.co", // defaults to http://localhost:3999
    });

    // initiate the /accounts API with the basepath and fetch library
    const accountsApi = new AccountsApi(apiConfig);

    // get transactions for a specific account
    const txs = await accountsApi.getAccountAssets({
      //const txs = await accountsApi.getAccountTransactions({
      principal: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
    });

    console.log(txs);
  };

  // Get info
  // https://stacks-node-api.testnet.stacks.co/
  // `http://localhost:3999/stacks-api/${assetAddress}.get-info`
  // https://stacks-node-api.testnet.stacks.co/extended/v1/address/{principal}/balances
  // `https://stacks-node-api.testnet.stacks.co/${assetAddress}.get-info`,

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>NFT API Code Tests</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col w-full items-center justify-center">
          <h1 className="text-6xl font-bold mb-10">NFT API Code Tests</h1>
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
        </div>
      </main>
    </div>
  );
}
