import mongoose from "mongoose"
import {MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH} from "../config/constraints";
import {User} from "../utils/typescript/interfaces";

const userSchema = new mongoose.Schema<User>({
  userId: {
    type: String,
    required: [true, 'User must have a unique login.'],
    unique: true,
    maxlength: [MAX_USERNAME_LENGTH, `User id can have maximum ${MAX_USERNAME_LENGTH} characters.`],
    minlength: [MIN_USERNAME_LENGTH, `User id should have at least ${MIN_USERNAME_LENGTH} characters.`],
    immutable: true
  },
  password: {
    type: String,
    required: [true, 'User must have a password.']
  },
  name: {
    type: String,
    required: [true, 'User must have a name to be displayed.'],
    maxlength: [MAX_USERNAME_LENGTH, `Username can have maximum ${MAX_USERNAME_LENGTH} characters.`],
    minlength: [MIN_USERNAME_LENGTH, `Username should have at least ${MIN_USERNAME_LENGTH} characters.`]
  },
  avatar: {
    type: String,
    required: [true, 'User must have an avatar']
  }
})

const UserModel = mongoose.model("UserModel", userSchema)

module.exports = UserModel;