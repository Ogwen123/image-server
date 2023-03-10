import kv from "../kv.json" assert { type: "json" }
import { types } from "../types"

let path: string = "";
const allFileData: types.FileDataToPrint[] = []//run npm log to list all the images stored on the server
kv.forEach((image: types.ImageData) => {
    const fileData = { code: image.code, type: image.fileType, path: image.filePath, filename: image.fileName }
    allFileData.push(fileData)

})

console.table(allFileData)
console.log("Total files: " + allFileData.length)


export { }