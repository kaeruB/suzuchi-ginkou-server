import {Router} from "express";

const authController = require("../controllers/authController")
const router = Router()

router.post("/signup", authController.signUp)
router.post("/login", authController.login)
router.post("/logout", authController.logout)

module.exports = router