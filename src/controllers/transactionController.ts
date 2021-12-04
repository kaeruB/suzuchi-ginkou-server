import {TransactionType} from "../models/transactionModels";

const Transaction = require("../models/transactionModels")
import { Request, Response } from "express";

exports.getTransactionHistory = async (req: Request, res: Response) => {
    try {
        const transactions = await Transaction.find()
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


exports.createTransaction = async (req: Request, res: Response) => {
    try {
        const transaction = await Transaction.create(req.body)

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

exports.updateTransaction = async (req: Request, res: Response) => {
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

exports.getTransactionsSummary = async (req: Request, res: Response) => {
    try {
        const history = await Transaction.find()

        const summary: { [borrowedBy: string]: number } = {}
        history.forEach((transaction: TransactionType) => {
            if (summary[transaction.borrowedBy] == null) {
                summary[transaction.borrowedBy] = 0;
            }
            summary[transaction.borrowedBy] += transaction.amount
        })

        res.status(200).json({
            status: 'success',
            results: Object.keys(summary).length,
            data: {
                history,
                summary
            }
        })
    } catch (e) {
        res.status(400).json({
            status: 'fail'
        })
    }
}

exports.deleteTransaction = async (req: Request, res: Response) => {
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