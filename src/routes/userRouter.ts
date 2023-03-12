// @ts-nocheck

import {Router} from "express";
import {protectUser} from "../middleware/userAuthMiddleware";
import {login, logout, signUp, updateUserNameAndAvatar} from "../controllers/userController";

const router = Router()

router.post("/signup", signUp)
router.post("/login", login)
router.post("/logout", protectUser, logout)
router.post("/update", protectUser, updateUserNameAndAvatar)

export default router
// module.exports = router