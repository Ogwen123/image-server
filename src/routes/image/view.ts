import { findImageData } from "../../findImageData.js"//gotta use .js so typescript doesn't complain even though it's a .ts file
import { types } from "../../types.js"
import { error } from "../../util/error.js"

export function view(req: Request | any, res: Response | any) {
    const urlArray = req.url.split("/")
    findImageData(urlArray[3]).then((imgPath) => {

        const parsedImgPath = imgPath as types.FindImageReturn

        if (!parsedImgPath.found) return error(404, "Not Found", "Image not found", res)

        res.status(200)
        res.set("Content-Type", "image/" + parsedImgPath.data!.fileType)
        res.sendFile(parsedImgPath.path!)
    }).catch((err: string) => {
        if (err === "404") return error(404, "Not Found", "Image not found", res)
    })
}