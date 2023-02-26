import {PairsSummary, UserDetails, UserEmailToDetails} from "../typescript/interfaces";
import {decodePairUserIds} from "../functions/commons";

const PairModel = require("../../models/pairModel")

const createUserEmailToDetailsObject = (
  usersDetailsWithUserEmail: Array<UserDetails & { userEmail: string }>
): UserEmailToDetails =>
  usersDetailsWithUserEmail.reduce((acc: UserEmailToDetails, current: UserDetails & { userEmail: string }) => {
    acc[current.userEmail] = {
      name: current.name,
      avatar: current.avatar
    }
    return acc
  }, {})

export const retrievePairsUsersDetails = async (userEmail: string): Promise<UserEmailToDetails> => {
  /**
   * SQL equivalent for @userEmail:
   *
   * SELECT U.userEmail, U.name, U.avatar
   * FROM Pair as P1
   * WHERE P1.userEmail=@userEmail
   *  JOIN Pair as P2
   *  ON P1.pairId = P2.pairId
   *  WHERE NOT P2.userEmail=@userEmail
   *   JOIN User as U
   *   ON U.userEmail = P2.userEmail
   */
  const usersDetailsInPairs: Array<UserDetails & { userEmail: string }> = await PairModel.aggregate([
    {$match: {userEmail}},
    {
      $lookup: {
        from: 'pairs',
        localField: 'pairId',
        foreignField: 'pairId',
        as: 'innerPairs',
      }
    },
    {$unwind: "$innerPairs"},
    {$match: {"innerPairs.userEmail": {$ne: userEmail}}},
    {
      $project: {
        'foreignUserEmail': '$innerPairs.userEmail',
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'foreignUserEmail',
        foreignField: 'userEmail',
        as: 'userDetails',
      },
    },
    {$unwind: "$userDetails"},
    {
      $project: {
        userEmail: '$userDetails.userEmail',
        name: '$userDetails.name',
        avatar: '$userDetails.avatar',
      }
    },
  ])

  return createUserEmailToDetailsObject(usersDetailsInPairs)
}

const createPairIdToSummaryObject = (
  transactionsSummaries: Array<{ pairId: string, userWhoPaid: string, amount: number }>
) => transactionsSummaries.reduce(
  (acc: PairsSummary, row: { pairId: string, userWhoPaid: string, amount: number }) => {
    if (acc[row.pairId] == null) {
      const pairUserIds = decodePairUserIds(row.pairId)
      acc[row.pairId] = {
        [pairUserIds[0]]: 0,
        [pairUserIds[1]]: 0
      }
    }

    if (row.userWhoPaid) {
      acc[row.pairId][row.userWhoPaid] += row.amount
    }
    return acc
  }, {})

export const retrievePairsSummaries = async (userEmail: string): Promise<PairsSummary> => {
  /**
   * SQL equivalent for @userEmail:
   *
   * SELECT P.pairId, T.userWhoPaid, COUNT(T.userWhoPaid)
   * FROM Pair as P
   * LEFT JOIN Transaction as T
   * ON P.pairId = T.pairId
   *  GROUP BY P.pairId, T.userWhoPaid
   */
  const transactionsSummaries: Array<{ pairId: string, userWhoPaid: string, amount: number }> =
    await PairModel.aggregate([
      {$match: {userEmail}},
      {
        $lookup: {
          from: 'transactions',
          localField: 'pairId',
          foreignField: 'pairId',
          as: 'transactions',
        }
      },
      {
        $unwind: {
          path: "$transactions",
          preserveNullAndEmptyArrays: true // preserving filtering out empty values for left join
        }
      },
      {
        $group: {
          _id: {
            pairId: "$pairId",
            userWhoPaid: "$transactions.userWhoPaid"
          },
          amount: {$sum: "$transactions.amount"}
        }
      },
      {
        $project: {
          pairId: '$_id.pairId',
          userWhoPaid: '$_id.userWhoPaid',
          amount: 1,
        }
      },
      {
        $sort: {
          amount: -1,
          pairId: 1
        }
      }
    ])

  return createPairIdToSummaryObject(transactionsSummaries)
}