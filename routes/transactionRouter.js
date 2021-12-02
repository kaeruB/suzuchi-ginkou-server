const express = require("express")

const transactionController = require("../controllers/transactionController")

const router = express.Router()

router.route("/")
    .get(transactionController.getTransactionHistory)
    .post(transactionController.createTransaction)

router.route("/summary")
    .get(transactionController.getTransactionsSummary)

module.exports = router