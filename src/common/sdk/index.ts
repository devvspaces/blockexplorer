import { alchemy } from "@config/index";

export async function getBlockNumber() {
  return alchemy.core.getBlockNumber()
}

export async function getBlock(blockNumber: number) {
  return alchemy.core.getBlock(blockNumber)
}

export async function getLastestBlockWithTx() {
  return getBlockWithTransactions(await getBlockNumber())
}

export async function getLatestBlocks(limit: number) {
  const latest = await getBlockNumber();
  const blocks = await Promise.all(
      Array.from({ length: limit }, (_, i) => {
          return getBlockWithTransactions(latest - i);
      })
  )
  return blocks
}

export async function getBlockWithTransactions(blockNumber: number) {
  return alchemy.core.getBlockWithTransactions(blockNumber)
}

export async function getTxReceipts(blockNumber: number) {
  return alchemy.core.getTransactionReceipts({ blockNumber: blockNumber.toString() })
}
