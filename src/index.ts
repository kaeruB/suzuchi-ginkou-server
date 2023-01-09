import {ALLOWED_CLIENT_URL} from "./config/url";

const express = require("express")
import mongoose from "mongoose"

const session = require("express-session")
import MongoStore from 'connect-mongo'

const cors = require('cors');
const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET} = require("./config/config")

const userRouter = require("./routes/userRouter")
const pairRouter = require("./routes/pairRouter")

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
  secret: SESSION_SECRET,
  cookie: {
    secure: false, // todo turn to true
    resave: false,
    saveUninitialized: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 100 // 100 min
  }
}))

app.use(express.json()) // to make the body attached to a request object
app.use(cors({
  credentials: true,
  origin: ALLOWED_CLIENT_URL
}))

app.use("/api/v1/users", userRouter)
app.use("/api/v1/pairs", pairRouter)

const port = process.env.PORT || 3005

app.listen(port, () => console.log(`listening on port ${port}`))

