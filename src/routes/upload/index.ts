import * as dotenv from "dotenv"
import { string } from "random-generator.js"
import fs from "fs"
dotenv.config({ path: "src/.env" })

import config from "../../config.json" assert { type: "json" }
import { findPath } from "../../findPath.js"//gotta use .js so typescript doesn't complain even though it's a .ts file
import { error } from "../../util/error.js"

function makeCode(filename: string) {
    filename = filename.split(".")[0]
    let unique = false
    let code: string;

    if (findPath(filename).found) {
        while (!unique) {
            code = string(6, { letters: true, case: "both" })
            const path = findPath(code)
            if (!path.found) unique = true
        }
    } else {
        code = filename.split(".")[0]
    }
    return code!
}

export function upload(req: Request | any, res: Response | any) {
    if (config.imageFolder === "") return error(500, "Internal Server Error", "The image folder has not been set in the config file", res)
    if (req.file === undefined) return error(400, "Bad Request", "No file was uploaded", res)

    try {

        const code = makeCode(req.file.originalname)
        //write new data to json file
        fs.readFile('src/kv.json', 'utf8', function readFileCallback(err, data) {
            if (err) {
                throw err
            } else {
                let obj = JSON.parse(data); //now it an object
                const fileData = {
                    code: code,
                    fileType: req.file?.mimetype.split("/")[1],
                    fileName: req.file?.filename,
                    fileNameWithoutDate: req.file?.originalname,// TODO to be changed
                    filePath: req.file?.path,
                    originalName: req.file?.originalname
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
    //console.table the data of the new file
    console.log("New file uploaded: ")
    const fileData = { mimetype: req.file.mimetype, destination: req.file.destination, filename: req.file.filename, size: req.file.size }
    console.table({ file: fileData })

    res.status(200)
    res.json({ code: 200, success: true, message: "File uploaded" })
}