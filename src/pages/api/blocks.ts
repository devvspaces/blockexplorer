import { NextApiRequest, NextApiResponse } from "next"
import { Utils } from 'alchemy-sdk'
import { getLatestBlocks } from "@common/sdk"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { limit } = req.query

    const blocks = await getLatestBlocks(Number(limit))

    res.status(200).json(blocks.map(block => ({
        blockNumber: block.number,
        transactions: block.transactions.length,
        amount: block.transactions.reduce((acc, tx) => {
            return acc + parseFloat(Utils.formatEther(tx.value.toString()))
        }, 0),
    })))
}

