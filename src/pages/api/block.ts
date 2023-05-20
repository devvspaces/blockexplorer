import { NextApiRequest, NextApiResponse } from "next"
import { getBlockWithTransactions } from "@/common/sdk";
import { bigNumbersToNumber, calculateTransactionTotal } from "@/common/sdk/utils";

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
    const data = {
        ...block,
        transactionCount: block.transactions.length,
        total: calculateTransactionTotal(block.transactions),
    }

    res.status(200).json(bigNumbersToNumber(data))
}

