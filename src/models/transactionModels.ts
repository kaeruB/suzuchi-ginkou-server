import mongoose from "mongoose"

export type TransactionType = {
    amount: number
    borrowedBy: string
    category: string
    description: string,
    date: string
}

const transactionSchema = new mongoose.Schema<TransactionType>({
    amount: {
        type: Number,
        require: [true, "Transaction has to have an amount."]
    },
    borrowedBy: {
        type: String,
        required: [true, "Transaction has to have specified who borrowed the money."]
    },
    category: {
        type: String,
        required: [true, "Transaction has to have a category."]
    },
    description: {
        type: String,
        required: [true, "Transaction has to have a description."]
    },
    date: {
        type: String,
        required: [true, "Transaction has to have a specified date."]
    }
})

const Transaction = mongoose.model("Transaction", transactionSchema)
module.exports = Transaction;