import {Router} from "express";

const transactionController = require("../controllers/transactionController")
const router = Router()

router.route("/")
    .get(transactionController.getTransactionHistory)
    .post(transactionController.createTransaction)

router.route("/summary")
    .get(transactionController.getTransactionsSummary)

router.route("/:id")
    .patch(transactionController.updateTransaction)
    .delete(transactionController.deleteTransaction)

module.exports = router