const BankStateTemporaryMock = {
    summary: {
        amount: 60000,
        borrowedBy: 'Kazu',
        borrowedFrom: 'Agata',
    },
    history: [
        {
            amount: 100,
            borrowedBy: 'Kazu',
            category: 'Sklep',
            description: 'jajka',
        },
        {
            amount: 100,
            borrowedBy: 'Kazu',
            category: 'Sklep',
            description: 'ikea stół',
        },
        {
            amount: 120,
            borrowedBy: 'Agata',
            category: 'Sklep',
            description: 'truskawki',
        },
        {
            amount: 100,
            borrowedBy: 'Kazu',
            category: 'Restauracja',
            description: 'risotto',
        },
        {
            amount: 100,
            borrowedBy: 'Kazu',
            category: 'Bilet',
            description: 'nidf',
        },
    ],
}


const express = require("express")
const mongoose = require("mongoose")
const cors = require('cors');
const {MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT} = require("./config/config")

const postRouter = require("./routes/postRoutes")
const userRouter = require("./routes/userRoutes")
const transactionRouter = require("./routes/transactionRouter")

const app = express()

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const connectWithRetry = () => {
    mongoose
        .connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => console.log('successfully connected to data base suzuchi ginkou'))
        .catch((e) => {
            console.log(e)
            setTimeout(connectWithRetry, 5000)
        })
}

connectWithRetry()

app.use(express.json()) // to make the body attached to a request object
app.use(cors({origin: 'http://localhost:3000'})) // to allow content-type header

app.get("/", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
    res.send([{url: 'https://cdn2.thecatapi.com/images/25b.jpg', height: 'Test message'}])
})

app.get("/bank/state", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
    res.send(BankStateTemporaryMock)
})

app.use("/api/v1/posts", postRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/transactions", transactionRouter)

const port = process.env.PORT || 3005

app.listen(port, () => console.log(`listening on port ${port}`))

