// @ts-nocheck

import {Router} from "express";
import {
  createTransaction,
  deleteTransaction,
  getTransactionsSummary,
  updateTransaction
} from "../controllers/transactionController";
import {createPair, getPairsSummaries} from "../controllers/pairController";
import {protectPair} from "../middleware/pairAuthMiddleware";
import {validateReqBodyForPairMismatch} from "../middleware/validateReqBodyForPairMismatchMiddleware";
import {protectUser} from "../middleware/userAuthMiddleware";

const router = Router()

router.route("/:pairId/transactions")
  .post(protectUser, protectPair, validateReqBodyForPairMismatch, createTransaction)

router.route("/:pairId/transactions/:id")
  .patch(protectUser, protectPair, validateReqBodyForPairMismatch, updateTransaction)
  .delete(protectUser, protectPair, deleteTransaction)

router.route("/:pairId/transactions/summary")
  .get(protectUser, protectPair, getTransactionsSummary)

router.route("/")
  .get(protectUser, getPairsSummaries)
  .post(protectUser, createPair)

export default router