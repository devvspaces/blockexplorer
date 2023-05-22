import { NextApiRequest, NextApiResponse } from "next"
import { bigNumbersToNumber, calculateTransactionTotal, isConfirmed, txToCurrency } from "@common/sdk/utils";
import { getBlockNumber, getBlockWithTransactions } from "@common/sdk";
import { Utils } from "alchemy-sdk";

interface Query {
  number?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { number }: Query = req.query;

  if (!number) {
    res.status(400).json({
      message: "Block number is required"
    })
    return;
  }


  const block = await getBlockWithTransactions(parseInt(number))
  const lastestBlockNumber = await getBlockNumber()
  const confirmations = lastestBlockNumber - block.number

  const data = {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? Utils.formatEther(block.baseFeePerGas) : null,
    finalized: isConfirmed(confirmations),
    transactionCount: block.transactions.length,
    total: calculateTransactionTotal(block.transactions),
    transactions: block.transactions.map(txToCurrency)
  }

  res.status(200).json(bigNumbersToNumber(data))
}
