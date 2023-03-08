import kv from "./kv.json" assert { type: "json" }
import { types } from "./types"

export function findPath(image_code: string): types.ReturnValue {
    let foundData: types.ImageData;
    let path: string = "";

    kv.forEach((image: types.ImageData) => {
        if (image.code === image_code) {
            foundData = image
            path = image.filePath
        }
    })

    return { found: (path ? true : false), path: (path ? path : undefined), data: (path ? foundData! : undefined) }
}