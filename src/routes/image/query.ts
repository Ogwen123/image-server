import { findPath } from "../../findPath.js"//gotta use .js so typescript doesn't complain even though it's a .ts file
import { error } from "../../util/error.js"
import { types } from "../../types.js"

export function query(req: Request | any, res: Response | any) {
    const urlArray = req.url.split("/")
    const path = findPath(urlArray[2])

    let returnObj: { code: number, found: boolean, path?: string, data?: types.ImageData } = {//make return object
        code: (path.found ? 200 : 404),
        found: path.found
    }

    if (path.found) {//if the path was found then add it to the return object
        returnObj.path = path.path
        returnObj.data = path.data
    }

    res.status(200)
    res.json(returnObj)
}