import {Router} from "express";

const authController = require("../controllers/authController")
const router = Router()

router.post("/signup", authController.signUp)
router.post("/login", authController.login)

module.exports = router