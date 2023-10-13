import { alchemy, settings } from "@config/index";
import { AddressData } from "@interfaces/index";
import { BigNumber } from "alchemy-sdk";
import axios from "axios";

export async function getBlockNumber() {
  return alchemy.core.getBlockNumber();
}

export async function getBlock(blockNumber: number) {
  return alchemy.core.getBlock(blockNumber);
}

export async function getLastestBlockWithTx() {
  return getBlockWithTransactions(await getBlockNumber());
}

export async function getLatestBlocks(limit: number) {
  const latest = await getBlockNumber();
  const blocks = await Promise.all(
    Array.from({ length: limit }, (_, i) => {
      return getBlockWithTransactions(latest - i);
    })
  );
  return blocks;
}

export async function getBlockWithTransactions(blockNumber: number) {
  return alchemy.core.getBlockWithTransactions(blockNumber);
}


export async function getAddressWithTransactions(
  address: string
): Promise<Omit<AddressData, "balance"> & { balance: BigNumber }> {
  const balance = await alchemy.core.getBalance(address);
  const tokens = await alchemy.core.getTokensForOwner(address)
  return {
    address,
    balance,
    transactions: [],
    tokens: tokens.tokens,
  };
}

export async function getAddressTransactions(address: string) {
  const url = `https://eth-mainnet.alchemyapi.io/v2/${settings.apiKey}`;

  const payload = {
    jsonrpc: "2.0",
    method: "eth_getLogs",
    params: [
      {
        address: [address],
        fromBlock: "earliest",
        toBlock: "latest",
        topics: [
          "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
        ],
      },
    ],
    id: 1,
  };

  axios
    .post(url, payload)
    .then((response) => {
      const data = response.data;

      if (data.result) {
        const transactions = data.result;
        // Sort transactions by block number or timestamp
        transactions.sort(
          (a: any, b: any) =>
            parseInt(b.blockNumber, 16) - parseInt(a.blockNumber, 16)
        );

        // Filter transactions related to the specific address
        const relevantTransactions = transactions.filter(
          (tx: any) => tx.topics[1] === address
        );

        for (const tx of relevantTransactions) {
          console.log(`Transaction Hash: ${tx.transactionHash}`);
          // Extract and process other relevant transaction data as needed
        }
      } else {
        console.log("No transactions found.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

export async function getTransaction(hash: string) {
  return alchemy.core.getTransaction(hash);
}

export async function getTransactionReceipt(hash: string) {
  return alchemy.core.getTransactionReceipt(hash);
}

export async function getTxReceipts(blockNumber: number) {
  return alchemy.core.getTransactionReceipts({
    blockNumber: blockNumber.toString(),
  });
}
