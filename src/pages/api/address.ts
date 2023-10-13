import { NextApiRequest, NextApiResponse } from "next";
import { bigNumbersToNumber, txToCurrency } from "@common/sdk/utils";
import { getAddressWithTransactions } from "@common/sdk";
import { Utils } from "alchemy-sdk";

interface Query {
  address?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address }: Query = req.query;

  if (!address) {
    res.status(400).json({
      message: "Address is required",
    });
    return;
  }

  const addressData = await getAddressWithTransactions(address);

  const data = {
    ...addressData,
    balance: Utils.formatEther(addressData.balance),
    transactions: addressData.transactions.map(txToCurrency),
  };

  res.status(200).json(bigNumbersToNumber(data));
}
