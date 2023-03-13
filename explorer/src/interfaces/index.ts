export interface Block {
    blockNumber: number,
    transactions: number,
    amount: number,
    hash: string,
    gasUsed: number,
}

export interface LastestBlock extends Block {}

export type Transaction = {
    txHash: string,
    from: string,
    to: string,
    amount: number,
}
