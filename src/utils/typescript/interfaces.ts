import {Request} from "express";
import {NODE_ENV_DEV, NODE_ENV_PROD} from "../constants/commons";

export type UserCredits = {
  userEmail: string,
  password: string,
}

export type UserDetails = {
  name: string,
  avatar: string
}

export type User = UserCredits & UserDetails
export type UserEmailToDetails = { [userEmail: string]: UserDetails }

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

// todo
// @ts-ignore
export interface RequestWithSession<M> extends Request {
  session?: {
    user: User,
    destroy: () => void
  },
  body: M
}

export interface Pair {
  pairId: string,
  userEmail: string
}

export type Summary = { [userWhoPaid: string]: number }
export type PairsSummary = { [pairId: string]: Summary }

export type NODE_ENVS = typeof NODE_ENV_DEV | typeof NODE_ENV_PROD