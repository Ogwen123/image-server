import fs from "fs"
import { types } from "./types"

export function findImageData(image_code: string): Promise<types.FindImageReturn | string> {
    return new Promise((resolve, reject) => {
        let found = false
        fs.readFile("src/kv.json", "utf8", (err, data) => {
            if (err) console.log(err)
            const kv = JSON.parse(data)
            //console.log(kv)
            kv.forEach((image: types.ImageData) => {
                if (found) return
                if (image.code === image_code) {
                    found = true
                    resolve({ found: (found ? true : false), path: (found ? image.filePath : undefined), data: (found ? image : undefined) })
                }
            })
            if (!found) reject("404")
        })
    })
}