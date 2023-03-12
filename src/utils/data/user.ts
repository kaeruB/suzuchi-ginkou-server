import {UserDetails, UserEmailToDetails} from "../typescript/interfaces";
import {UserModel} from "../../models/userModel";

export const retrieveUsersDetails = async (userEmails: Array<string>): Promise<UserEmailToDetails> => {
  /**
   * SQL equivalent for @userEmail:
   *
   * SELECT U.name, U.avatar
   * FROM User as U
   * WHERE U.userEmail = @userEmail
   */

  const userDetails: Array<UserDetails & { userEmail: string }> = await UserModel
    .find({userEmail: {$in: userEmails}}, {userEmail: 1, name: 1, avatar: 1, _id: false})

  return userDetails.reduce((acc: UserEmailToDetails, u: UserDetails & { userEmail: string }) => {
    acc[u.userEmail] = {
      name: u.name,
      avatar: u.avatar
    }
    return acc
  }, {})
}