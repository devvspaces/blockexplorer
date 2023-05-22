import { REQUIRED_CONFIRMATION } from "@common/constants"
import { BigNumber, TransactionResponse } from "alchemy-sdk"
import { Utils } from 'alchemy-sdk'

/**
 * Converts a big number to eth value
 * 
 * @param bigNumber a eth big number
 * @returns 
 */
export const bigNumberToEther = (bigNumber: BigNumber) => {
  return parseFloat(Utils.formatEther(bigNumber.toHexString()))
}

/**
 * Calculate the total amount of eth transacted is an
 * array of transactions
 * 
 * @param transactions array of TransactionResponses
 * @returns 
 */
export const calculateTransactionTotal = (transactions: TransactionResponse[]) => {
  return transactions.reduce((acc, tx) => {
    return acc + bigNumberToEther(tx.value)
  }, 0).toFixed(6)
}

/**
 * Convert every big number key in data to
 * normal number
 * 
 * @param data object
 * @returns 
 */
export const bigNumbersToNumber = (data: { [key: string]: any }) => {
  const keys = Object.keys(data);
  const newData: typeof data = {};

  keys.forEach(key => {
    if (data[key] instanceof BigNumber) {
      const value: BigNumber = data[key];
      newData[key] = value.toString();
    } else {
      newData[key] = data[key]
    }
  })

  return newData;
}

export const txToCurrency = (tx: TransactionResponse) => {
  let amount = tx.value.toString()
  let currency = "Wei"
  if (parseInt(amount) > 1_000_000) {
    amount = Utils.formatEther(tx.value.toString())
    currency = 'ETH'
  }
  return {
    ...tx,
    amount,
    currency,
  }
}


export const isConfirmed = (confirmations: number) => {
  return confirmations >= REQUIRED_CONFIRMATION
}


export const getTxnType = (type: number) => {
  switch (type) {
    case 0:
      return "Legacy"
    case 1:
      return "Contract Creation"
    case 2:
      return "Contract Call"
    case 3:
      return "Contract Creation (Ethreum Istanbul Hard Fork)"

    default:
      return null;
  }
}

