import mongoose from "mongoose"
import {MAX_USERNAME_LENGTH, MIN_USERNAME_LENGTH} from "../config/constraints";

export type User = {
    username: string,
    password: string
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'User must have a user name.'],
        unique: true,
        maxlength: [MAX_USERNAME_LENGTH, `Username can have maximum ${MAX_USERNAME_LENGTH} characters.`],
        minlength: [MIN_USERNAME_LENGTH, `Username should have at least ${MIN_USERNAME_LENGTH} characters.`]
    },
    password: {
        type: String,
        required: [true, 'User must have a password.']
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User;