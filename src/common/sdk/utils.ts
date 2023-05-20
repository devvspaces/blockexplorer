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
      newData[key] = value.toNumber();
    } else {
      newData[key] = data[key]
    }
  })

  return newData;
}
