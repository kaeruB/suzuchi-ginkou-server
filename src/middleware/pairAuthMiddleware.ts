import {NextFunction, Response} from "express";
import {RequestWithSession} from "../utils/typescript/interfaces";
import {decodePairIdToUserIds} from "../utils/functions/commons";
import {STATUS_UNAUTHORIZED} from "../utils/constants/responseCodes";

export const protectPair = (req: RequestWithSession<{}>, res: Response, next: NextFunction) => {
  const user = req.session && req.session.user
  const pairId = req.params.pairId

  const pairUserIds = pairId && decodePairIdToUserIds(pairId)

  if (!pairUserIds || !user || !pairUserIds.find(u => u === user.userEmail)) {
    return res.status(STATUS_UNAUTHORIZED)
      .json({
        status: 'fail',
        message: `Logged in user is not authorized to access data for pair ${pairId}.`
      })
  }

  next()
}