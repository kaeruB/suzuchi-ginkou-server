import {Response} from "express";
import {checkPasswordBeforeHashing} from "../utils/functions/validators";
import {DUPLICATE_SYMBOL_MONGO_ERR} from "../utils/constants/commons";
import {RequestWithSession, User, UserCredits, UserDetails,} from "../utils/typescript/interfaces";
import {
  STATUS_BAD_REQUEST,
  STATUS_CREATED,
  STATUS_NOT_FOUND,
  STATUS_OK,
  WRONG_INPUT_ERR_CODE
} from "../utils/constants/responseCodes";

import bcrypt from 'bcryptjs';
import {UserModel} from "../models/userModel";


export const signUp = async (req: RequestWithSession<User>, res: Response) => {
  const user: User = req.body

  const passwordConstraintsError = checkPasswordBeforeHashing(user.userEmail, user.password)

  if (passwordConstraintsError) {
    res.status(WRONG_INPUT_ERR_CODE).json({
      status: "fail",
      message: passwordConstraintsError
    })
  } else {
    try {
      const hashPassword = await bcrypt.hash(user.password, 12)
      const newUser = await UserModel.create({
        userEmail: user.userEmail,
        password: hashPassword,
        name: user.name,
        avatar: user.avatar
      });
      if (req.session) {
        req.session.user = newUser
        res.status(STATUS_CREATED).json({
          status: 'success',
          data: {
            user: {
              name: newUser.name,
              avatar: newUser.avatar
            }
          }
        })
      }
    } catch (e: any) {
      if (e.code && e.code === DUPLICATE_SYMBOL_MONGO_ERR) {
        res.status(WRONG_INPUT_ERR_CODE).json({
          status: "fail",
          message: "The email address is already in use. Specify a different email address."
        })
      } else if (e.message) {
        res.status(WRONG_INPUT_ERR_CODE).json({
          status: "fail",
          message: e.message
        })
      } else {
        res.status(STATUS_BAD_REQUEST).json({
          status: "fail",
          message: "Unknown server error"
        })
      }
    }
  }
}

export const login = async (req: RequestWithSession<UserCredits>, res: Response) => {
  const user: UserCredits = req.body

  try {
    const userInDatabase: User | null = await UserModel.findOne({userEmail: user.userEmail})

    if (!userInDatabase) {
      return res.status(STATUS_NOT_FOUND).json({
        status: 'fail',
        message: 'User not found'
      })
    }

    const isCorrect = await bcrypt.compare(user.password, userInDatabase.password)

    if (isCorrect && req.session) {
      req.session.user = userInDatabase
      res.status(STATUS_OK).json({
        status: 'success',
        data: {
          user: {
            name: userInDatabase.name,
            avatar: userInDatabase.avatar
          }
        }
      })
    } else {
      res.status(STATUS_BAD_REQUEST).json({
        status: 'fail',
        message: 'Incorrect email address or password'
      })
    }
  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: "fail"
    })
  }
}

export const logout = async (req: RequestWithSession<UserCredits>, res: Response) => {
  try {
    if (req.session && req.session.user) {
      req.session.destroy()

      res.status(STATUS_OK).json({
        status: 'success'
      })
    } else {
      return res.status(STATUS_NOT_FOUND).json({
        status: 'fail',
        message: 'User not found'
      })
    }
  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: "fail",
      message: "Unexpected error while logging out"
    })
  }
}

export const updateUserNameAndAvatar = async (req: RequestWithSession<UserDetails>, res: Response) => {
  try {
    const updatedUserDetails: UserDetails = req.body

    const userEmail = req.session && req.session.user.userEmail
    const userDetails: User | null = await UserModel
      .findOneAndUpdate({userEmail}, updatedUserDetails, {
        new: true,
        runValidators: true
      })

    res.status(STATUS_OK).json({
      status: 'success',
      data: {
        user: {
          name: userDetails?.name,
          avatar: userDetails?.avatar
        }
      }
    })
  } catch (e) {
    res.status(STATUS_BAD_REQUEST).json({
      status: 'fail'
    })
  }
}