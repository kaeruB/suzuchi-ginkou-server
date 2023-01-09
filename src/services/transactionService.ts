import {Request} from "express";
import Transaction, {TransactionType} from "../models/transactionModels";

export const getLimitedHistoryAndSummary = async (req: Request) => {
  const getMoneyGroupedByPerson = (history: Array<TransactionType>) => {
    const summary: { [borrowedBy: string]: number } = {}
    history.forEach((transaction: TransactionType) => {
      if (summary[transaction.borrowedBy] == null) {
        summary[transaction.borrowedBy] = 0
      }
      summary[transaction.borrowedBy] += transaction.amount
    })
    return summary
  }

  const historyListLength: number | undefined = (req.query.historyListLength && Number.parseInt(req.query.historyListLength as string)) || undefined
  const history = await Transaction.find().sort({'timestamp': -1})
  const summary: { [borrowedBy: string]: number } = getMoneyGroupedByPerson(history)
  const limitedHistory = (historyListLength && historyListLength - 1 < history.length) ?
  history.slice(0, historyListLength) : history

  return {summary, limitedHistory}
}


