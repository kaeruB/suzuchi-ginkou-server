import {MIN_PASSWORD_LENGTH} from "../../config/constraints";

export const hasPasswordNumber = (password: string): boolean => {
  const NUMBERS_REGEX = /\d/
  return NUMBERS_REGEX.test(password)
}

export const hasPasswordLetter = (password: string): boolean => {
  const LETTERS_REGEX = /[a-zA-Z]/
  return LETTERS_REGEX.test(password)
}

export const isPasswordDifferentThanUserEmail = (
  userEmail: string,
  password: string
): boolean => password !== userEmail

export const isStringLongEnough = (
  str: string,
  minStringLength: number,
): boolean => str.length >= minStringLength


export const checkPasswordBeforeHashing = (userEmail: string, password: string): string | null => {
  if (!isStringLongEnough(password, MIN_PASSWORD_LENGTH)) {
    return `Password should have at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  if (!isPasswordDifferentThanUserEmail(userEmail, password)) {
    return "Password shouldn't be the same as email address."
  }
  if (!hasPasswordNumber(password)) {
    return 'Password should contain at least one number.'
  }
  if (!hasPasswordLetter(password)) {
    return 'Password should contain at least one letter.'
  }

  return null
}