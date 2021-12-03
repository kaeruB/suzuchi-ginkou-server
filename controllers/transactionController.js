const Transaction = require("../models/transactionModels")
const Post = require("../models/postModels");

exports.getTransactionHistory = async (req, res, next) => {
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


exports.createTransaction = async (req, res, next) => {
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

exports.updateTransaction = async (req, res, next) => {
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

exports.getTransactionsSummary = async (req, res, next) => {
    try {
        const history = await Transaction.find()

        const summary = {}
        history.forEach(transaction => {
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

exports.deleteTransaction = async (req, res, next) => {
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