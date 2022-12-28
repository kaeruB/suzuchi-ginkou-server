import {User} from "../../models/userModel";
import {MIN_PASSWORD_LENGTH} from "../../config/constraints";

export const hasPasswordNumber = (password: string): boolean => {
    const NUMBERS_REGEX = /\d/
    return NUMBERS_REGEX.test(password)
}

export const hasPasswordLetter = (password: string): boolean => {
    const LETTERS_REGEX = /[a-zA-Z]/
    return LETTERS_REGEX.test(password)
}

export const isPasswordDifferentThanUsername = (
    user: User,
): boolean => user.password !== user.username

export const isStringLongEnough = (
    str: string,
    minStringLength: number,
): boolean => str.length >= minStringLength


export const checkPasswordBeforeHashing = (user: User): string | null => {
    if (!isStringLongEnough(user.password, MIN_PASSWORD_LENGTH)) {
        return `Password should have at least ${MIN_PASSWORD_LENGTH} characters.`
    }
    if (!isPasswordDifferentThanUsername(user)) {
        return "Password shouldn't be the same as username."
    }
    if (!hasPasswordNumber(user.password)) {
        return 'Password should contain at least one number.'
    }
    if (!hasPasswordLetter(user.password)) {
        return 'Password should contain at least one letter.'
    }

    return null
}