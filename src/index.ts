import express from "express"
import * as dotenv from "dotenv"
import multer from "multer"
dotenv.config({ path: "src/.env" })

import config from "./config.json" assert { type: "json" }
import { error } from "./util/error.js"

//route imports
import { upload } from "./routes/upload/index.js"//gotta use .js so typescript doesn't complain even though it's a .ts file
import { query } from "./routes/image/query.js"
import { view } from "./routes/image/view.js"//   ^
import { all } from "./routes/images/index.js"
import { filter } from "./routes/images/filter.js"

const app = express()

//get the image via the code
app.get("/image/*", (req, res) => {
    const urlOptions = ["query", "view"]
    const urlArray = req.url.split("/")
    //check if the url is in the correct format, if not return an error message
    if (urlArray.length !== 4) return error(400, "Bad Request", "URL should be in the format /image/view/{image_code} or /image/query/{image_code}", res)
    if (urlArray[3].length !== 6) return error(400, "Bad Request", "Image code should be 6 characters long", res)
    if (urlOptions.includes(urlArray[2])) {
        if (urlArray[2] === "query") {
            query(req, res)
        } else if (urlArray[2] === "view") {
            view(req, res)
        }
    }
})

//get all the images
app.get("/images", (req, res) => all(req, res))
app.get("/images/filter", (req, res) => {
    if (Object.keys(req.query).length === 0) return error(400, "Bad URL", "No query parameters were provided", res)
    const type = req.query.type || false
    const date = req.query.date || false
    const name = req.query.name || false
    const queryParams = [type, date, name]

    filter(req, res, queryParams)
})

//handle uploading images
const storage: multer.StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.imageFolder)

    },
    filename: (req, file, cb) => {
        //make date
        const date = new Date()
        const formatted_date = date.toISOString().replace("Z", "").replace(/:/g, "-")
        cb(null, formatted_date + file.originalname)
    }
})

const multer_upload: multer.Multer = multer({
    dest: config.imageFolder,
    storage: storage
})

app.post("/upload", multer_upload.single("image"), (req, res) => upload(req, res))

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})