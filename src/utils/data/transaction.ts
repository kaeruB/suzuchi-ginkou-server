import {Transaction} from "../typescript/interfaces";
import {TransactionModel} from "../../models/transactionModel";

export const retrieveTransactions = async (pairId: string): Promise<Array<Transaction>> => {
  const transactions: Array<Transaction> = await TransactionModel.aggregate([
    {$match: {pairId}},
    {$sort: {timestamp: -1}},
  ])
  return transactions
}