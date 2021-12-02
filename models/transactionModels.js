const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
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
    }
})

const Transaction = mongoose.model("Transaction", transactionSchema)
module.exports = Transaction;