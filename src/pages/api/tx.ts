import { NextApiRequest, NextApiResponse } from "next"
import { bigNumbersToNumber, getTxnType, isConfirmed, txToCurrency } from "@common/sdk/utils";
import { getBlock, getTransaction, getTransactionReceipt } from "@common/sdk";
import { Utils } from "alchemy-sdk";

interface Query {
  hash?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { hash }: Query = req.query;

  if (!hash) {
    res.status(400).json({
      message: "Transaction hash is required"
    })
    return;
  }

  const txReponse = await getTransaction(hash)
  const txReceipt = await getTransactionReceipt(hash)
  if (!txReponse || !txReceipt) {
    res.status(400).json({
      message: "Transaction not found"
    })
    return;
  }
  const block = await getBlock(txReceipt.blockNumber)

  const newReponse = txToCurrency(txReponse)
  const txFee = parseInt(txReceipt.gasUsed.toString()) * parseInt(txReceipt.effectiveGasPrice.toString())
  const data = {
    ...newReponse,
    ...txReceipt,
    finalized: isConfirmed(txReceipt.confirmations),
    txFeeFormat: {
      "gwei": Utils.formatUnits(txFee.toString(), "gwei"),
      "eth": Utils.formatEther(txFee.toString())
    },
    gasPriceFormat: {
      "gwei": Utils.formatUnits(txReceipt.effectiveGasPrice.toString(), "gwei"),
      "eth": Utils.formatEther(txReceipt.effectiveGasPrice.toString())
    },
    gasUsedPercent: parseFloat((parseInt(txReceipt.gasUsed.toString()) / parseInt(txReponse.gasLimit.toString())).toFixed(2)) * 100,
    typeFormat: getTxnType(txReceipt.type),
    timestamp: block.timestamp,
  };
  res.status(200).json(bigNumbersToNumber(data))
}
