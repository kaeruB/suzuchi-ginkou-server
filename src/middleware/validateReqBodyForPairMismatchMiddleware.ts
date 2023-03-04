import {NextFunction, Response} from "express";
import {RequestWithSession, Transaction} from "../utils/typescript/interfaces";
import {decodePairIdToUserIds} from "../utils/functions/commons";
import {STATUS_UNAUTHORIZED} from "../utils/constants/responseCodes";

const validateReqBodyForPairMismatch = (req: RequestWithSession<Transaction>, res: Response, next: NextFunction) => {
  const pairId = req.params.pairId
  const transactionFromReq: Transaction = req.body

  const pairUserIds = pairId && decodePairIdToUserIds(pairId)

  if (!pairUserIds || !pairUserIds.find(uId => uId === transactionFromReq.userWhoPaid)) {
    return res.status(STATUS_UNAUTHORIZED)
      .json({
        status: 'fail',
        message: `Wrong value in userWhoPaid field - there is no user ${transactionFromReq.userWhoPaid} for pair ${pairUserIds[0]} and ${pairUserIds[1]}`
      })
  }

  next()
}

module.exports = validateReqBodyForPairMismatch