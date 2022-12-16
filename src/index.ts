import {ALLOWED_CLIENT_URL} from "./config/url";

const express = require("express")
import mongoose from "mongoose"
const session = require("express-session")
import MongoStore from 'connect-mongo'
const cors = require('cors');
const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT} = require("./config/config")

const userRouter = require("./routes/userRoutes")
const transactionRouter = require("./routes/transactionRouter")

const app = express()

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
        .connect(mongoUrl)
        .then(() => console.log('successfully connected to data base suzuchi ginkou'))
        .catch((e: string) => {
            console.log(`couldn\'t connect to suzuchi ginkou with error: ${e}`)
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry()

app.use(session({
    store: MongoStore.create({mongoUrl}),
    secret: 'test', // TODO add secret
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 30 // 30 min
    }
}))

app.use(express.json()) // to make the body attached to a request object
app.use(cors({
    credentials: true,
    origin: ALLOWED_CLIENT_URL
}))

app.use("/api/v1/users", userRouter)
app.use("/api/v1/transactions", transactionRouter)

const port = process.env.PORT || 3005

app.listen(port, () => console.log(`listening on port ${port}`))

