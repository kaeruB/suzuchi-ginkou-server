import {Response} from "express";
import {RequestWithSession, Transaction} from "../utils/typescript/interfaces";
import {groupMoneyByUserInPair, decodePairUserIds} from "../utils/functions/commons";
import {retrieveUsersDetails} from "../utils/data/user";
import {retrieveTransactions} from "../utils/data/transaction";
import {STATUS_BAD_REQUEST, STATUS_CREATED, STATUS_OK} from "../utils/constants/responseCodes";
import {DEFAULT_HISTORY_ITEMS} from "../utils/constants/commons";

const TransactionModel = require("../models/transactionModel")
const PairModel = require("../models/pairModel")

exports.createTransaction = async (req: RequestWithSession<Transaction>, res: Response) => {
  try {
    const userEmail = req.session && req.session.user.userEmail
    const pairId = req.params.pairId

    const doesPairExist = await PairModel.findOne({pairId, userEmail})

    if (doesPairExist) {
      const transaction = await TransactionModel.create({
        ...req.body,
        pairId
      })

      res.status(STATUS_CREATED).json({
        status: 'success',
        data: {
          transaction
        }
      })
    } else {
      res.status(STATUS_BAD_REQUEST).json({
        status: 'fail',
        message: `Pair with id ${pairId} is not found for user ${userEmail}.`
      })
    }
  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: 'fail'
    })
  }
}

exports.updateTransaction = async (req: RequestWithSession<Transaction>, res: Response) => {
  try {
    const updatedTransaction: Transaction = req.body
    const transactionId = req.params.id

    const transaction = await TransactionModel
      .findByIdAndUpdate(transactionId, updatedTransaction, {
        new: true,
        runValidators: true
      })

    res.status(STATUS_OK).json({
      status: 'success',
      data: {
        transaction
      }
    })
  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: 'fail'
    })
  }
}

exports.getTransactionsSummary = async (req: RequestWithSession<{}>, res: Response) => {
  try {
    const pairId = req.params.pairId
    const pairUserIds = decodePairUserIds(pairId)
    const noOfTransactionsSetByUser = Number.parseInt(req.query.historyListLength as string)
    const noOfTransactionsToRetrieve: number = req.query.historyListLength ?
      noOfTransactionsSetByUser :
      DEFAULT_HISTORY_ITEMS

    const transactions: Array<Transaction> = await retrieveTransactions(pairId)
    const summary = groupMoneyByUserInPair(transactions, pairUserIds)
    const usersDetails = await retrieveUsersDetails(pairUserIds)

    const totalTransactions = transactions.length

    res.status(STATUS_OK).json({
      status: 'success',
      data: {
        transactions: transactions.slice(0, noOfTransactionsToRetrieve),
        totalTransactions,
        summary,
        usersDetails
      }
    })

  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: 'fail'
    })
  }
}

exports.deleteTransaction = async (req: RequestWithSession<{}>, res: Response) => {
  try {
    const pairId = req.params.pairId
    const transactionId = req.params.id

    await TransactionModel.findByIdAndDelete({_id: transactionId, pairId})

    res.status(STATUS_OK).json({
      status: 'success'
    })
  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: 'fail'
    })
  }
}