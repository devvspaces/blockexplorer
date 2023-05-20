import { getBlockNumber, getBlockWithTransactions } from "@common/sdk"
import { NextApiRequest, NextApiResponse } from "next"
import { Utils } from 'alchemy-sdk'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { limit } = req.query

  const blockWithTxs = await getBlockWithTransactions(await getBlockNumber())

  const transactions = blockWithTxs.transactions.slice(0, Number(limit))

  res.status(200).json(transactions.map(tx => ({
    txHash: tx.hash,
    from: tx.from,
    to: tx.to,
    amount: Utils.formatEther(tx.value.toString()),
  })))
}
