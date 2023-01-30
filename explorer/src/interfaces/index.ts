export type LastestBlock = {
    blockNumber: number,
    transactions: number,
    amount: number,
}

export type Transaction = {
    txHash: string,
    from: string,
    to: string,
    amount: number,
}
