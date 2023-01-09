import {UserDetails, UserIdToDetails} from "../typescript/interfaces";

const UserModel = require("../../models/userModel")

export const retrieveUsersDetails = async (userIds: Array<string>): Promise<UserIdToDetails> => {
  /**
   * SQL equivalent for @userId:
   *
   * SELECT U.name, U.avatar
   * FROM User as U
   * WHERE U.userId = @userId
   */

  const userDetails: Array<UserDetails & { userId: string }> = await UserModel
    .find({userId: {$in: userIds}}, {userId: 1, name: 1, avatar: 1, _id: false})

  return userDetails.reduce((acc: UserIdToDetails, u: UserDetails & { userId: string }) => {
    acc[u.userId] = {
      name: u.name,
      avatar: u.avatar
    }
    return acc
  }, {})
}