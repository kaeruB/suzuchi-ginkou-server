import mongoose from "mongoose"

export enum Person {
    KAZU = 'Kazu',
    AGATA = 'Agata',
}

export enum Category {
    SHOPPING = 'Shopping',
    HOME = 'Home',
    HEALTH = 'Health',
    ENTERTAINMENT = 'Entertainment',
    OTHER = 'Other'
}

export type TransactionType = {
    amount: number
    borrowedBy: Person
    category: Category
    description: string,
    timestamp: number,
    username: string
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
    timestamp: {
        type: Number,
        required: [true, "Transaction has to have a specified timestamp."]
    },
    username: {
        type: String,
        required: [true, "Transaction must be bound to a specific user."]
    }
})

const Transaction = mongoose.model("Transaction", transactionSchema)
module.exports = Transaction;