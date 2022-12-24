import {TransactionType} from "../models/transactionModels";
import {Response} from "express";
import {RequestWithSession} from "../models/requestModels";

const Transaction = require("../models/transactionModels")

exports.getTransactionHistory = async (req: RequestWithSession, res: Response) => {
    try {
        const username = req.session && req.session.user.username
        const transactions = await Transaction.find({username})
        res.status(200).json({
            status: 'success',
            results: transactions.length,
            data: {
                transactions
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
    }
}


exports.createTransaction = async (req: RequestWithSession, res: Response) => {
    try {
        const username = req.session && req.session.user.username
        const transaction = await Transaction.create({
            ...req.body,
            username
        })

        res.status(200).json({
            status: 'success',
            data: {
                transaction
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
    }
}

exports.updateTransaction = async (req: RequestWithSession, res: Response) => {
    try {
        const transaction = await Transaction.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: 'success',
            data: {
                transaction
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
    }
}

exports.getTransactionsSummary = async (req: RequestWithSession, res: Response) => {
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

    try {
        const username = req.session && req.session.user.username

        const historyListLength: number | undefined =
            (req.query.historyListLength && Number.parseInt(req.query.historyListLength as string)) || undefined
        const history = await Transaction.find({username}).sort({'timestamp': -1})
        const summary: { [borrowedBy: string]: number } = getMoneyGroupedByPerson(history)
        const limitedHistory = (historyListLength && historyListLength - 1 < history.length) ?
            history.slice(0, historyListLength) : history

        res.status(200).json({
            status: 'success',
            results: Object.keys(summary).length,
            data: {
                history: limitedHistory,
                summary
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
    }
}

exports.deleteTransaction = async (req: RequestWithSession, res: Response) => {
    try {
        await Transaction.findByIdAndDelete(req.params.id)

        res.status(200).json({
            status: 'success'
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
    }
}