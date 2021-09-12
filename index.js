const express = require("express")

const app = express()

app.get("/", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', "http://localhost:3000")
    res.send([{url: 'https://cdn2.thecatapi.com/images/25b.jpg', height: 'Test message'}])
})

const port = process.env.PORT || 3005

app.listen(port, () => console.log(`listening on port ${port}`))

