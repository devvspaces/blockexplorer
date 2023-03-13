import { getLastestBlockWithTx, getLatestBlocks } from "@/config"
import { NextApiRequest, NextApiResponse } from "next"
import { Utils } from 'alchemy-sdk'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const block = await getLastestBlockWithTx();

    res.status(200).json({
        blockNumber: block.number,
        hash: block.hash,
        gasUsed: block.gasUsed.toNumber(),
        transactions: block.transactions.length,
        amount: block.transactions.reduce((acc, tx) => {
            return acc + parseFloat(Utils.formatEther(tx.value.toHexString()))
        }, 0).toFixed(6),
    })
}
