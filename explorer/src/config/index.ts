import { Alchemy, Network } from 'alchemy-sdk';

const settings = {
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


const alchemy = new Alchemy(settings);

export async function getBlockNumber() {
    return alchemy.core.getBlockNumber()
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
