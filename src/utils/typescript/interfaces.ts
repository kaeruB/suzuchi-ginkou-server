import {Request} from "express";

export type UserCredits = {
  userId: string,
  password: string,
}

export type UserDetails = {
  name: string,
  avatar: string
}

export type User = UserCredits & UserDetails
export type UserIdToDetails = { [userId: string]: UserDetails }

enum Category {
  SHOPPING = 'Shopping',
  HOME = 'Home',
  HEALTH = 'Health',
  ENTERTAINMENT = 'Entertainment',
  OTHER = 'Other'
}

export interface Transaction {
  pairId: string,
  amount: number
  userWhoPaid: string
  category: Category
  description: string,
  timestamp: number,
}

export interface RequestWithSession<M> extends Request {
  session?: {
    user: User,
    destroy: () => void
  },
  body: M
}

export interface Pair {
  pairId: string,
  userId: string
}

export type Summary = { [userWhoPaid: string]: number }
export type PairsSummary = { [pairId: string]: Summary }