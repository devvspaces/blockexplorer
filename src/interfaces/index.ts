import { BlockWithTransactions, TransactionResponse } from "alchemy-sdk";

export interface Block {
    blockNumber: number,
    transactions: number,
    amount: number,
    hash: string,
    gasUsed: number,
}

export interface LastestBlock extends Block { }

export type Transaction = {
    txHash: string,
    from: string,
    to: string,
    amount: number,
}

export interface BlockWithTransactionsData extends Omit<BlockWithTransactions, 'gasUsed'> {
    transactionCount: number;
    total: string;
    gasUsed: number;
    finalized: boolean;
    transactions: Array<TransactionResponse & {
      amount: string;
      currency: string;
    }>;
}


export type DynamicObject = { [key: string]: any }