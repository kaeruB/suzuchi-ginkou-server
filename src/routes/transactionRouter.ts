import {Router} from "express";

const transactionController = require("../controllers/transactionController")
const protect = require('../middleware/authMiddleware')

const router = Router()

router.route("/")
    .get(protect, transactionController.getTransactionHistory)
    .post(protect, transactionController.createTransaction)

router.route("/summary")
    .get(protect, transactionController.getTransactionsSummary)

router.route("/:id")
    .patch(protect, transactionController.updateTransaction)
    .delete(protect, transactionController.deleteTransaction)

module.exports = router