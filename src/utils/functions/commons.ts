import {Summary, Transaction} from "../typescript/interfaces";
import {PAIR_ID_SEPARATOR} from "../constants/commons";

export const createPairId =
  (userEmail1: string | undefined, userEmail2: string | undefined): string | false => {
    if (userEmail1 && userEmail2 && (userEmail1 !== userEmail2)) {
      return [userEmail1, userEmail2].sort().join(PAIR_ID_SEPARATOR)
    }
    return false
  }

export const retrieveUsersIdsFromPairId =
  (pairId: string): Array<string> => pairId.split(PAIR_ID_SEPARATOR)

export const groupMoneyByUserInPair = (
  history: Array<Transaction>,
  usersIdsInPair: Array<string>
): { [userWhoPaid: string]: number } => {
  const summary: Summary = {
    [usersIdsInPair[0]]: 0,
    [usersIdsInPair[1]]: 0
  }
  history.forEach((transaction: Transaction) => {
    summary[transaction.userWhoPaid] += transaction.amount
  })
  return summary
}