import express from "express"
import mysql from "mysql2"
import * as dotenv from "dotenv"
dotenv.config({ path: "src/.env" })

import config from "./config.json" assert {type: "json"}

const app = express()

type row = {
    code: string,
    path: string
}

const findPath = async (code: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection(process.env.DATABASE_URL)
        console.log(process.env.DATABASE_URL)
        connection.connect()
        connection.query('SELECT * FROM KV WHERE code = "' + code + '"', function (err: any, rows: row[], fields: any) {
            if (err) throw err
            try {
                resolve(rows[0].path)
            } catch {
                reject("Error")
            }

        })
    })
}

app.get("/image/*", async (req, res) => {
    const urlArray = req.url.split("/")
    let path;
    if (urlArray.length !== 3) res.status(400).json({ "error": "Invalid URL", "message": "URL should be in the format /image/{image_code}", "code": 400 })
    await findPath(urlArray[2]).then((result) => {
        path = result
    }).catch((err) => {
        res.status(404).json({ "code": 404, "error": "Not Found", "message": "Image not found" })
        return
    })
    res.status(200)
    res.json({ path: path })

})

app.listen(config.port, () => [
    console.log("Server is running on port 5000")
])