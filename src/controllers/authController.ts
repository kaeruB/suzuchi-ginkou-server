const User = require("../models/userModel")
import {Request, Response} from "express";

const bcrypt = require("bcryptjs")

exports.signUp = async (req: Request, res: Response) => {
    const {username, password} = req.body

    try {
        const hashPassword = await bcrypt.hash(password, 12)
        const newUser = await User.create({
            username,
            password: hashPassword
        });
        (req as any).session.user = newUser // assign user to session
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.login = async (req: Request, res: Response) => {
    const {username, password} = req.body

    try {
        const user = await User.findOne({username})

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'user not found'
            })
        }

        const isCorrect = await bcrypt.compare(password, user.password)

        if (isCorrect) {
            (req as any).session.user = user // assign user to session, if successfully logged in
            res.status(200).json({
                status: 'success'
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'incorrect username or password'
            })
        }
    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}