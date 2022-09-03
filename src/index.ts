const express = require("express")
import mongoose from "mongoose";
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
            console.log(e)
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry()

app.use(express.json()) // to make the body attached to a request object
app.use(cors({origin: 'http://139.177.178.87'})) // to allow content-type header

app.use("/api/v1/users", userRouter)
app.use("/api/v1/transactions", transactionRouter)

const port = process.env.PORT || 3005

app.listen(port, () => console.log(`listening on port ${port}`))

