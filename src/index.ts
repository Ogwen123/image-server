import express from "express"
import * as dotenv from "dotenv"
import multer from "multer"
import { string } from "random-generator.js"
import fs from "fs"
dotenv.config({ path: "src/.env" })

import config from "./config.json" assert { type: "json" }
import { findPath } from "./findPath.js"//gotta use .js so typescript doesn't complain even though it's a .ts file
import { error } from "./util/error.js"

const app = express()

app.get("/image/*", (req, res) => {
    const urlArray = req.url.split("/")
    //check if the url is in the correct format, if not return an error message
    if (urlArray.length !== 3) return error(400, "Bad Request", "URL should be in the format /image/{image_code}", res)
    const path = findPath(urlArray[2])

    let returnObj: { code: number, found: boolean, path?: string } = {//make return object
        code: (path.found ? 200 : 404),
        found: path.found
    }

    if (path.found) {//if the path was found then add it to the return object
        returnObj.path = path.path
    }

    res.status(200)
    res.json(returnObj)
})

//handle uploading images
const storage = multer.diskStorage({
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
const upload = multer({
    dest: config.imageFolder,
    storage: storage
})

app.post("/upload", upload.single("image"), (req, res) => {
    if (config.imageFolder === "") return error(500, "Internal Server Error", "The image folder has not been set in the config file", res)
    if (req.file === undefined) return error(400, "Bad Request", "No file was uploaded", res)

    try {
        let unique = false
        let code: string;
        while (!unique) {
            code = string(6, { letters: true, case: "both" })
            const path = findPath(code)
            if (!path.found) unique = true

        }

        fs.readFile('src/kv.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                throw err
            } else {
                let obj = JSON.parse(data); //now it an object
                const fileData = {
                    code: code,
                    fileType: req.file?.mimetype.split("/")[0],
                    fileName: req.file?.filename,
                    filePath: req.file?.path
                }
                obj.push(fileData); //add some data
                let json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('src/kv.json', json, 'utf8', (err) => {
                    if (err) throw err;
                }); // write it back 
            }
        });
    } catch {
        return error(500, "Internal Server Error", "An error occurred while uploading the file", res)
    }
    const fileData = { mimetype: req.file.mimetype, destination: req.file.destination, filename: req.file.filename, size: req.file.size }
    console.table({ file: fileData })

    res.status(200)
    res.json({ code: 200, success: true, message: "File uploaded" })
})

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})