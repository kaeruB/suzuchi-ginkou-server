import {Response} from "express";
import {RequestWithSession, Transaction} from "../utils/typescript/interfaces";
import {groupMoneyByUserInPair, retrieveUsersIdsFromPairId} from "../utils/functions/commons";
import {retrieveUsersDetails} from "../utils/data/user";
import {retrieveTransactions} from "../utils/data/transaction";
import {STATUS_BAD_REQUEST, STATUS_CREATED, STATUS_OK} from "../utils/constants/responseCodes";

const TransactionModel = require("../models/transactionModel")
const PairModel = require("../models/pairModel")

exports.createTransaction = async (req: RequestWithSession<Transaction>, res: Response) => {
  try {
    const userId = req.session && req.session.user.userId
    const pairId = req.params.pairId

    const doesPairExist = await PairModel.findOne({pairId, userId})

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
        message: `Pair with id ${pairId} is not found for user ${userId}.`
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
    const usersIdsInPair = retrieveUsersIdsFromPairId(pairId)
    const noOfTransactionsToRetrieve: number = req.query.historyListLength ?
      Number.parseInt(req.query.historyListLength as string) : 5

    const transactions: Array<Transaction> = await retrieveTransactions(pairId)
    const summary = groupMoneyByUserInPair(transactions, usersIdsInPair)
    const usersDetails = await retrieveUsersDetails(usersIdsInPair)

    res.status(STATUS_OK).json({
      status: 'success',
      data: {
        transactions: transactions.slice(0, noOfTransactionsToRetrieve),
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