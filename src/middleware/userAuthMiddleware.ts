import {NextFunction, Response} from "express";
import {RequestWithSession} from "../utils/typescript/interfaces";
import {STATUS_UNAUTHORIZED} from "../utils/constants/responseCodes";

const protectUser = (req: RequestWithSession<{}>, res: Response, next: NextFunction) => {
  const user = req.session && req.session.user

  if (!user) {
    return res.status(STATUS_UNAUTHORIZED)
      .json({status: 'fail', message: 'unauthorized'})
  }

  next()
}

module.exports = protectUser