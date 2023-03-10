import { findImageData } from "../../findImageData.js"//gotta use .js so typescript doesn't complain even though it's a .ts file
import { error } from "../../util/error.js"
import { types } from "../../types.js"

export function query(req: Request | any, res: Response | any) {
    const urlArray = req.url.split("/")
    findImageData(urlArray[2]).then((data) => {
        const parsedData = data as types.FindImageReturn

        let returnObj: { code: number, found: boolean, path?: string, data?: types.ImageData } = {//make return object
            code: (parsedData.found ? 200 : 404),
            found: parsedData.found
        }

        if (parsedData.found) {//if the path was found then add it to the return object
            returnObj.path = parsedData.path
            returnObj.data = parsedData.data
        }

        res.status(200)
        res.json(returnObj)
    })


}