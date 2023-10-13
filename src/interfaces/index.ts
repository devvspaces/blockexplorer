import { getTxnType, txToCurrency } from "@common/sdk/utils";
import {
  BlockWithTransactions,
  TransactionReceipt,
  TransactionResponse,
} from "alchemy-sdk";

export interface Block {
  blockNumber: number;
  transactions: number;
  amount: number;
  hash: string;
  gasUsed: number;
}

export interface LastestBlock extends Block {}

export type Transaction = {
  txHash: string;
  from: string;
  to: string;
  amount: number;
};

export interface BlockWithTransactionsData
  extends Omit<BlockWithTransactions, "gasUsed"> {
  transactionCount: number;
  total: string;
  gasUsed: number;
  finalized: boolean;
  transactions: Array<
    TransactionResponse & {
      amount: string;
      currency: string;
    }
  >;
}

export interface Token {
  contractAddress: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logo?: string;
}

export interface AddressData {
  address: string;
  balance: string;
  transactions: Array<
    TransactionResponse & {
      amount: string;
      currency: string;
    }
  >;
  tokens: (Token & {
    balance?: string;
  })[];
}

export type TxType = ReturnType<typeof txToCurrency> &
  TransactionReceipt & {
    finalized: boolean;
    txFeeFormat: {
      gwei: string;
      eth: string;
    };
    gasPriceFormat: {
      gwei: string;
      eth: string;
    };
    gasUsedPercent: number;
    typeFormat: ReturnType<typeof getTxnType>;
    timestamp: number;
    gasLimit: string;
    gasUsed: string;
  };

export type DynamicObject = { [key: string]: any };
