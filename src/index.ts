import {ALLOWED_CLIENT_URL} from "./config/url";

import path from "path";

const express = require("express")
import mongoose from "mongoose"

const session = require("express-session")
import MongoStore from 'connect-mongo'
import {NODE_ENVS} from "./utils/typescript/interfaces";
import {NODE_ENV_DEV, NODE_ENV_PROD} from "./utils/constants/commons";

const cors = require('cors');
const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET} = require("./config/config")

const userRouter = require("./routes/userRouter")
const pairRouter = require("./routes/pairRouter")

const app = express()

const https = require("https");
const fs = require("fs");

const nodeEnv: NODE_ENVS = process.env.NODE_ENV as NODE_ENVS || NODE_ENV_DEV

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
    secure: nodeEnv === NODE_ENV_PROD,
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

if (nodeEnv === NODE_ENV_DEV) {
  app.listen(port, () => console.log(`Listening on port ${port}, environment ${nodeEnv}`))
} else {
  const privateKey = fs.readFileSync(path.join(__dirname, './cert/privkey1.pem'), 'utf8');
  const certificate = fs.readFileSync(path.join(__dirname, './cert/cert1.pem'), 'utf8');
  const ca = fs.readFileSync(path.join(__dirname, './cert/chain1.pem'), 'utf8');

  const sslCertCredentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  https
    .createServer( sslCertCredentials, app)
    .listen(port, () => console.log(`Listening on port ${port}, environment ${nodeEnv}`))
}