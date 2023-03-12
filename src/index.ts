import {ALLOWED_CLIENT_URL} from "./config/url";

import path from "path";

import express from "express";
import mongoose from "mongoose"
import session from "express-session"
import MongoStore from 'connect-mongo'
import {NODE_ENVS} from "./utils/typescript/interfaces";
import {NODE_ENV_DEV, NODE_ENV_PROD} from "./utils/constants/commons";
import {SESSION_MAX_AGE} from "./config/constraints";
import cors from "cors";

import {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET} from "./config/config"

import userRouter from "./routes/userRouter"
import pairRouter from "./routes/pairRouter"

import {readFileSync} from "fs";
import {createServer} from "https";

const app = express()

const nodeEnv: NODE_ENVS = process.env.NODE_ENV as NODE_ENVS || NODE_ENV_DEV

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

console.log('mongoUrl', mongoUrl)

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

const cookieOptions: session.CookieOptions = {
  secure: nodeEnv === NODE_ENV_PROD,
  httpOnly: true,
  maxAge: SESSION_MAX_AGE
}

app.use(session({
  store: MongoStore.create({mongoUrl}),
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: cookieOptions
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
  const privateKey = readFileSync(path.join(__dirname, './cert/privkey1.pem'), 'utf8');
  const certificate = readFileSync(path.join(__dirname, './cert/cert1.pem'), 'utf8');
  const ca = readFileSync(path.join(__dirname, './cert/chain1.pem'), 'utf8');

  const sslCertCredentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };

  createServer(sslCertCredentials, app)
    .listen(port, () => console.log(`Listening on port ${port}, environment ${nodeEnv}`))
}