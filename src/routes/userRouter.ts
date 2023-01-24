import {Router} from "express";

const userController = require("../controllers/userController")
const router = Router()
const protectUser = require('../middleware/userAuthMiddleware')

router.post("/signup", userController.signUp)
router.post("/login", userController.login)
router.post("/logout", protectUser, userController.logout)
router.post("/update", protectUser, userController.updateUserNameAndAvatar)

module.exports = router