import express from "express"

const app = express()

app.get("/image/*", (req, res) => {
    res.send(req.url.split("/")[1])
})

app.listen(3000, () => [
    console.log("Server is running on port 3000")
])