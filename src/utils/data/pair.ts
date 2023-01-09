import {PairsSummary, UserDetails, UserIdToDetails} from "../typescript/interfaces";
import {retrieveUsersIdsFromPairId} from "../functions/commons";

const PairModel = require("../../models/pairModel")

const createUserIdToDetailsObject = (
  usersDetailsWithUserId: Array<UserDetails & { userId: string }>
): UserIdToDetails =>
  usersDetailsWithUserId.reduce((acc: UserIdToDetails, current: UserDetails & { userId: string }) => {
    acc[current.userId] = {
      name: current.name,
      avatar: current.avatar
    }
    return acc
  }, {})

export const retrievePairsUsersDetails = async (userId: string): Promise<UserIdToDetails> => {
  /**
   * SQL equivalent for @userId:
   *
   * SELECT U.userId, U.name, U.avatar
   * FROM Pair as P1
   * WHERE P1.userId=@userId
   *  JOIN Pair as P2
   *  ON P1.pairId = P2.pairId
   *  WHERE NOT P2.userId=@userId
   *   JOIN User as U
   *   ON U.userId = P2.userId
   */
  const usersDetailsInPairs: Array<UserDetails & { userId: string }> = await PairModel.aggregate([
    {$match: {userId}},
    {
      $lookup: {
        from: 'pairs',
        localField: 'pairId',
        foreignField: 'pairId',
        as: 'innerPairs',
      }
    },
    {$unwind: "$innerPairs"},
    {$match: {"innerPairs.userId": {$ne: userId}}},
    {
      $project: {
        'foreignUserId': '$innerPairs.userId',
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'foreignUserId',
        foreignField: 'userId',
        as: 'userDetails',
      },
    },
    {$unwind: "$userDetails"},
    {
      $project: {
        userId: '$userDetails.userId',
        name: '$userDetails.name',
        avatar: '$userDetails.avatar',
      }
    },
  ])

  return createUserIdToDetailsObject(usersDetailsInPairs)
}

const createPairIdToSummaryObject = (
  transactionsSummaries: Array<{ pairId: string, borrowedBy: string, amount: number }>
) => transactionsSummaries.reduce(
  (acc: PairsSummary, row: { pairId: string, borrowedBy: string, amount: number }) => {
    if (acc[row.pairId] == null) {
      const usersInPairIds = retrieveUsersIdsFromPairId(row.pairId)
      acc[row.pairId] = {
        [usersInPairIds[0]]: 0,
        [usersInPairIds[1]]: 0
      }
    }

    if (row.borrowedBy) {
      acc[row.pairId][row.borrowedBy] += row.amount
    }
    return acc
  }, {})

export const retrievePairsSummaries = async (userId: string): Promise<PairsSummary> => {
  /**
   * SQL equivalent for @userId:
   *
   * SELECT P.pairId, T.borrowedBy, COUNT(T.borrowedBy)
   * FROM Pair as P
   * LEFT JOIN Transaction as T
   * ON P.pairId = T.pairId
   *  GROUP BY P.pairId, T.borrowedBy
   */
  const transactionsSummaries: Array<{ pairId: string, borrowedBy: string, amount: number }> =
    await PairModel.aggregate([
      {$match: {userId}},
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
            borrowedBy: "$transactions.borrowedBy"
          },
          amount: {$sum: "$transactions.amount"}
        }
      },
      {
        $project: {
          pairId: '$_id.pairId',
          borrowedBy: '$_id.borrowedBy',
          amount: 1,
        }
      },
    ])

  return createPairIdToSummaryObject(transactionsSummaries)
}