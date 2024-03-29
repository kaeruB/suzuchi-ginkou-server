import mongoose from "mongoose"
import {Transaction} from "../utils/typescript/interfaces";

const transactionSchema = new mongoose.Schema<Transaction>({
  pairId: {
    type: String,
    unique: false,
    require: [true, "Transaction must belong to a pair of users."],
    immutable: true
  },
  amount: {
    type: Number,
    require: [true, "Transaction has to have an amount."]
  },
  userWhoPaid: {
    type: String,
    required: [true, "Transaction has to have specified who paid the money."]
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
  }
})

const TransactionModel = mongoose.model("Transaction", transactionSchema)
module.exports = TransactionModel;