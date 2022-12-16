import {NextFunction, Response} from "express";
import {RequestWithSession} from "../models/requestModels";

const protect = (req: RequestWithSession, res: Response, next: NextFunction) => {
    const {user} = req.session

    if (!user) {
        return res.status(401).json({status: 'fail', message: 'unauthorized'})
    }

    next()
}

module.exports = protect