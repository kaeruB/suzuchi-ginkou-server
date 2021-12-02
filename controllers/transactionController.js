const Transaction = require("../models/transactionModels")

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