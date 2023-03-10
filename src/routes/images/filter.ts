import { types } from "../../types.js"
import { error } from "../../util/error.js"

import fs from "fs"

export function filter(req: Request | any, res: Request | any, filterParams: any[]) {// should be working :TM:
    const matchingImages: any[] = []
    let hasReturned = false
    fs.readFile("src/kv.json", "utf8", (err, kv) => {
        const images: types.ImageData[] = JSON.parse(kv)
        images.forEach((image: types.ImageData) => {
            if (hasReturned) return
            if (filterParams[0] !== false) {
                if (image.fileType === filterParams[0]) matchingImages.push(image)
                else {
                    if (matchingImages.includes(image)) delete matchingImages[matchingImages.indexOf(image)]
                }
            }
            if (filterParams[1] !== false) {
                const date = image.fileName.substring(0, 11).split("-")
                const fileYear = date[0]
                const fileMonth = date[1]
                const fileDay = date[2].substring(0, 2)
                filterParams[1] = filterParams[1].trim()
                console.log(filterParams[1].length === 10)
                if (filterParams[1].length !== 10) {
                    hasReturned = true
                    return error(400, "Bad Request", "Date should be in the format DD/MM/YYYY", res);
                }
                const qYear = filterParams[1].split("/")[2]
                const qMonth = filterParams[1].split("/")[1]
                const qDay = filterParams[1].split("/")[0]
                console.log(qYear, qMonth, qDay)
                console.log(fileYear, fileMonth, fileDay)
                let matchingSoFar = true
                if (qYear !== "****" && matchingSoFar) {
                    if (qYear !== fileYear) matchingSoFar = false;
                }
                if (qMonth !== "**" && matchingSoFar) {
                    if (qMonth !== fileMonth) matchingSoFar = false;
                }
                if (qDay !== "**" && matchingSoFar) {
                    if (qDay !== fileDay) matchingSoFar = false;
                }
                if (matchingSoFar) matchingImages.push(image)
                else {
                    if (matchingImages.includes(image)) delete matchingImages[matchingImages.indexOf(image)]
                }
            }
            if (filterParams[2] !== false) {
                if (image.fileNameWithoutDate.includes(filterParams[2])) matchingImages.push(image)
                else {
                    if (matchingImages.includes(image)) delete matchingImages[matchingImages.indexOf(image)]
                }
            }
        })
        if (hasReturned) return
    })
    if (hasReturned) return
    res.status(200)
    const response = { code: 200, success: true, total_images: matchingImages.length, data: matchingImages }
    res.json(response)
}