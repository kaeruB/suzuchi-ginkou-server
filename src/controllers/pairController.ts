import {Response} from "express";
import {Pair, RequestWithSession, UserIdToDetails} from "../utils/typescript/interfaces";
import {createPairId} from "../utils/functions/commons";
import {retrievePairsSummaries, retrievePairsUsersDetails} from "../utils/data/pair";
import {retrieveUsersDetails} from "../utils/data/user";
import {STATUS_BAD_REQUEST, STATUS_CREATED, STATUS_OK, WRONG_INPUT_ERR_CODE} from "../utils/constants/responseCodes";

const PairModel = require("../models/pairModel")
const UserModel = require("../models/userModel")

exports.getPairsSummaries = async (req: RequestWithSession<Pair>, res: Response) => {
  try {
    const userId = (req.session && req.session.user.userId) as string

    const currentUserDetails = await retrieveUsersDetails([userId])
    const usersDetails: UserIdToDetails = await retrievePairsUsersDetails(userId)
    usersDetails[userId] = currentUserDetails[userId]

    const pairsSummaries = await retrievePairsSummaries(userId)

    res.status(STATUS_OK).json({
      status: 'success',
      data: {
        pairsSummaries,
        usersDetails
      }
    })
  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: 'fail'
    })
  }
}

exports.createPair = async (req: RequestWithSession<{ partnerId: string }>, res: Response) => {
  const {partnerId} = req.body

  try {
    const isPartnerIdInDatabase = await UserModel.findOne({userId: partnerId})
    const creatorUserId = req.session && req.session.user.userId

    const pairId = isPartnerIdInDatabase && createPairId(partnerId, creatorUserId)

    if (pairId) {
      const pairInDatabase: Pair = await PairModel.findOne({pairId})
      if (!pairInDatabase) {
        const newPair1 = await PairModel.create({
          pairId,
          userId: creatorUserId
        });
        const newPair2 = await PairModel.create({
          pairId,
          userId: partnerId
        });

        res.status(STATUS_CREATED).json({
          status: 'success',
          data: {
            pairId
          }
        })
      } else {
        res.status(WRONG_INPUT_ERR_CODE).json({
          status: 'fail',
          message: `The pair for ${creatorUserId} and ${partnerId} already exists.`
        })
      }
    } else {
      res.status(WRONG_INPUT_ERR_CODE).json({
        status: 'fail',
        message: 'Users ids not correct.'
      })
    }

  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: 'fail'
    })
  }
}