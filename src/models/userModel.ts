import mongoose from "mongoose"
import {MAX_USER_EMAIL_LENGTH, MIN_USER_EMAIL_LENGTH} from "../config/constraints";
import {User} from "../utils/typescript/interfaces";

const userSchema = new mongoose.Schema<User>({
  userEmail: {
    type: String,
    required: [true, 'User must have specified a unique email address.'],
    unique: true,
    maxlength: [MAX_USER_EMAIL_LENGTH, `Email address can have maximum ${MAX_USER_EMAIL_LENGTH} characters.`],
    minlength: [MIN_USER_EMAIL_LENGTH, `Email should have at least ${MIN_USER_EMAIL_LENGTH} characters.`],
    immutable: true
  },
  password: {
    type: String,
    required: [true, 'User must have a password.']
  },
  name: {
    type: String,
    required: [true, 'User must have a name to be displayed.'],
    maxlength: [MAX_USER_EMAIL_LENGTH, `Username can have maximum ${MAX_USER_EMAIL_LENGTH} characters.`],
    minlength: [MIN_USER_EMAIL_LENGTH, `Username should have at least ${MIN_USER_EMAIL_LENGTH} characters.`]
  },
  avatar: {
    type: String,
    required: [true, 'User must have an avatar']
  }
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel;