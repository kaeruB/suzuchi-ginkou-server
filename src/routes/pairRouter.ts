import {Router} from "express";

const pairController = require("../controllers/pairController")
const transactionController = require("../controllers/transactionController")
const protectUser = require('../middleware/userAuthMiddleware')
const protectPair = require('../middleware/pairAuthMiddleware')
const validateReqBodyForPairMismatch = require('../middleware/validateReqBodyForPairMismatchMiddleware')

const router = Router()

router.route("/:pairId/transactions")
  .post(protectUser, protectPair, validateReqBodyForPairMismatch, transactionController.createTransaction)

router.route("/:pairId/transactions/:id")
  .patch(protectUser, protectPair, validateReqBodyForPairMismatch, transactionController.updateTransaction)
  .delete(protectUser, protectPair, transactionController.deleteTransaction)

router.route("/:pairId/transactions/summary")
  .get(protectUser, protectPair, transactionController.getTransactionsSummary)

router.route("/")
  .get(protectUser, pairController.getPairsSummaries)
  .post(protectUser, pairController.createPair)

module.exports = router