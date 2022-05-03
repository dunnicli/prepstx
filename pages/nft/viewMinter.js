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
  standardPrincipalCV,
  deserializeCV,
  cvToString,
  hexToCV,
} from "@stacks/transactions";

export default function ApiCode() {
  const [theUri, setTheUri] = useState("");
  const [theTid, setTheTid] = useState();
  const [theLatest, setTheLatest] = useState(0);
  const [theJson, setTheJson] = useState("");
  const [theMinter, setTheMinter] = useState("");
  const [thatJson, setThatJson] = useState("");
  const [thatMinter, setThatMinter] = useState("");

  const handleTheMinterChange = (e) => {
    setTheMinter(e.target.value);
  };

  const getLatest = async (e) => {
    e.preventDefault();
    const apiConfig = new Configuration({
      fetchApi: fetch,
      // for mainnet, replace `testnet` with `mainnet`
      //basePath: "https://stacks-node-api.testnet.stacks.co", // defaults to http://localhost:3999
      basePath: "http://localhost:3999",
    });

    // initiate the /accounts API with the basepath and fetch library
    const accountsApi = new AccountsApi(apiConfig);
    const smartContractsApi = new SmartContractsApi(apiConfig);

    const txs = await accountsApi.getAccountAssets({
      //principal: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
      principal: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
    });
    console.log(txs);

    const turi = await smartContractsApi.callReadOnlyFunction({
      contractAddress: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
      contractName: "acatv4",
      functionName: "get-last-token-id",
      readOnlyFunctionArgs: {
        sender: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
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
      //basePath: "https://stacks-node-api.testnet.stacks.co", // defaults to http://localhost:3999
      basePath: "http://localhost:3999",
    });

    // initiate the /accounts API with the basepath and fetch library
    const accountsApi = new AccountsApi(apiConfig);
    const smartContractsApi = new SmartContractsApi(apiConfig);

    // get transactions for a specific account
    const txs = await accountsApi.getAccountAssets({
      //principal: "ST12H4ANQQ2NGN96KB0ZYVDG02NWT99A9TPE22SP9",
      principal: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
    });
    console.log(txs);

    const turi = await smartContractsApi.callReadOnlyFunction({
      contractAddress: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
      contractName: "acatv4",
      functionName: "get-minter",
      readOnlyFunctionArgs: {
        sender: "ST3H0F71SQXP2APJX29HBQN4FAZP5H0W564KD9ZDS",
        arguments: [cvToHex(standardPrincipalCV(theMinter))],
      },
    });
    const resultCV = deserializeCV(turi.result);
    console.log(JSON.stringify(resultCV));

    const resultMinter = resultCV.value.data;
    //const response = await fetch(resultMinter);

    //if (!response.ok) throw new Error(response.statusText);

    //const json = await response.json();
    setThatMinter(resultCV.value.data);
    //setThatJson(json);
    console.log("Minter:", resultCV.value.data);
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
              Minter Address:
              <br />
              <input
                className="p-6 border rounded mx-2"
                type="text"
                required={true}
                value={theMinter}
                onChange={handleTheMinterChange}
                placeholder="Minters Address"
              />
            </p>
            <p>&nbsp;</p>
            <button
              type="submit"
              className="bg-white-500 mb-6 rounded border-2 border-black py-2 px-4 font-bold hover:bg-gray-300"
            >
              Get Minter
            </button>
          </form>
          <h1>Minter: {thatMinter}</h1>

          <p>&nbsp;</p>

          <hr />
        </div>
      </main>
    </div>
  );
}
