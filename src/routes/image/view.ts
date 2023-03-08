import { findPath } from "../../findPath.js"//gotta use .js so typescript doesn't complain even though it's a .ts file
import { types } from "../../types.js"
import { error } from "../../util/error.js"

export function view(req: Request | any, res: Response | any) {
    const urlArray = req.url.split("/")
    const imgPath: types.ReturnValue = findPath(urlArray[3])

    if (!imgPath.found) return error(404, "Not Found", "Image not found", res)

    res.status(200)
    res.set("Content-Type", "image/" + imgPath.data!.fileType)
    res.sendFile(imgPath.path!)
}