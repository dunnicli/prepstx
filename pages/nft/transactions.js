import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Head from "next/head";
import fetch from "cross-fetch";
import { cvToString, hexToCV } from "@stacks/transactions";

export default function TransCode() {
  const [theTxId, setTheTxId] = useState();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("");
  const [tokenId, setTokenId] = useState("");

  const handleTheTxIdChange = (e) => {
    setTheTxId(e.target.value);
  };

  const getTransInfo = async (e) => {
    e.preventDefault();

    const tx = await fetch(`http://localhost:3999/extended/v1/tx/${theTxId}`)
      .then((response) => response.json())
      .then((actualData) => {
        setData(actualData);
        //setError(null);
        let stuff = data.tx_status;
        console.log("Token ID:", data.tx_result.repr);
        let tid = data.tx_result.repr;
        let subtid = tid.slice(3, -1);
        const mystring = subtid.replace("u", "");
        setTokenId(mystring);
        setStatus(stuff);
        console.log("TID:", mystring); // 45
        console.log("Status:", stuff);
        console.log("Details:", data);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>** Transactions **</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex flex-col w-full items-center justify-center">
          <h1 className="text-6xl font-bold mb-10">Transactions!</h1>
          <p>
            <Link href="/"> Home</Link>
          </p>
          <p>&nbsp;</p>
          <form onSubmit={getTransInfo}>
            <p>
              Token ID
              <br />
              <input
                className="p-6 border rounded mx-2"
                type="text"
                required={true}
                value={theTxId}
                onChange={handleTheTxIdChange}
                placeholder="Tranasction ID"
              />
            </p>
            <p>&nbsp;</p>
            <button
              type="submit"
              className="bg-white-500 mb-6 rounded border-2 border-black py-2 px-4 font-bold hover:bg-gray-300"
            >
              Get Transaction Info
            </button>
          </form>

          <p>&nbsp;</p>
          <h1>Status: {status}</h1>
          <p>&nbsp;</p>
          <h1>Token ID: {tokenId} </h1>
          <p>&nbsp;</p>
          <hr />
        </div>
      </main>
    </div>
  );
}
