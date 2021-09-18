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

const app = express()

app.get("/", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
    res.send([{url: 'https://cdn2.thecatapi.com/images/25b.jpg', height: 'Test message'}])
})

app.get("/bank/state", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
    res.send(BankStateTemporaryMock)
})

const port = process.env.PORT || 3005

app.listen(port, () => console.log(`listening on port ${port}`))

