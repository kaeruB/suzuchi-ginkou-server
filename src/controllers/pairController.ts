import {Response} from "express";
import {Pair, RequestWithSession, UserEmailToDetails} from "../utils/typescript/interfaces";
import {createPairId} from "../utils/functions/commons";
import {retrievePairsSummaries, retrievePairsUsersDetails} from "../utils/data/pair";
import {retrieveUsersDetails} from "../utils/data/user";
import {STATUS_BAD_REQUEST, STATUS_CREATED, STATUS_OK, WRONG_INPUT_ERR_CODE} from "../utils/constants/responseCodes";
import {UserModel} from "../models/userModel";
import {PairModel} from "../models/pairModel";

export const getPairsSummaries = async (req: RequestWithSession<Pair>, res: Response) => {
  try {
    const userEmail = (req.session && req.session.user.userEmail) as string

    const currentUserDetails = await retrieveUsersDetails([userEmail])
    const usersDetails: UserEmailToDetails = await retrievePairsUsersDetails(userEmail)
    usersDetails[userEmail] = currentUserDetails[userEmail]

    const pairsSummaries = await retrievePairsSummaries(userEmail)

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

export const createPair = async (req: RequestWithSession<{ partnerEmail: string }>, res: Response) => {
  const {partnerEmail} = req.body

  try {
    const isPartnerEmailInDatabase = await UserModel.findOne({userEmail: partnerEmail})
    const creatorUserEmail = req.session && req.session.user.userEmail

    const pairId = isPartnerEmailInDatabase && createPairId(partnerEmail, creatorUserEmail)

    if (pairId) {
      const pairInDatabase: Pair | null = await PairModel.findOne({pairId})
      if (!pairInDatabase) {
        const newPair1 = await PairModel.create({
          pairId,
          userEmail: creatorUserEmail
        });
        const newPair2 = await PairModel.create({
          pairId,
          userEmail: partnerEmail
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
          message: `The pair for ${creatorUserEmail} and ${partnerEmail} already exists.`
        })
      }
    } else {
      res.status(WRONG_INPUT_ERR_CODE).json({
        status: 'fail',
        message: 'Address email not correct.'
      })
    }

  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: 'fail'
    })
  }
}