import {RequestWithSession} from "../models/requestModels";
import {Response} from "express";
import {checkPasswordBeforeHashing} from "../utils/functions/validators";
import {
    DUPLICATE_SYMBOL_MONGO_ERR,
    STATUS_BAD_REQUEST,
    STATUS_CREATED, STATUS_NOT_FOUND,
    STATUS_OK,
    WRONG_INPUT_ERR_CODE
} from "../utils/constants/commons";

const User = require("../models/userModel")
const bcrypt = require("bcryptjs")

exports.signUp = async (req: RequestWithSession, res: Response) => {
    const {username, password} = req.body

    const passwordConstraintsError = checkPasswordBeforeHashing({username, password})

    if (passwordConstraintsError) {
        res.status(WRONG_INPUT_ERR_CODE).json({
            status: "fail",
            message: passwordConstraintsError
        })
    } else {
        try {
            const hashPassword = await bcrypt.hash(password, 12)
            const newUser = await User.create({
                username,
                password: hashPassword
            });
            if (req.session) {
                req.session.user = newUser
                res.status(STATUS_CREATED).json({
                    status: 'success',
                    data: {
                        user: newUser
                    }
                })
            }
        } catch (e: any) {
            if (e.code && e.code === DUPLICATE_SYMBOL_MONGO_ERR) {
                res.status(WRONG_INPUT_ERR_CODE).json({
                    status: "fail",
                    message: "The username is already in use. Specify a different username."
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

exports.login = async (req: RequestWithSession, res: Response) => {
    const {username, password} = req.body

    try {
        const user = await User.findOne({username})

        if (!user) {
            return res.status(STATUS_NOT_FOUND).json({
                status: 'fail',
                message: 'User not found'
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect && req.session) {
            req.session.user = user
            res.status(STATUS_OK).json({
                status: 'success'
            })
        } else {
            res.status(STATUS_BAD_REQUEST).json({
                status: 'fail',
                message: 'Incorrect username or password'
            })
        }
    } catch (e) {
        res.status(STATUS_BAD_REQUEST).json({
            status: "fail"
        })
    }
}

exports.logout = async (req: RequestWithSession, res: Response) => {
    try {
        if (req.session && req.session.user) {
            // req.session.destroy() todo remove session

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