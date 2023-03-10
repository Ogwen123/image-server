import fs from "fs"

export function all(req: Request | any, res: Request | any) {
    fs.readFile("src/kv.json", "utf8", (err, data) => {
        if (err) {
            console.log(err)
            return
        }
        const kv = JSON.parse(data)
        res.status(200)
        res.header("Access-Control-Allow-Origin", "*")
        const response = { code: 200, success: true, total_images: kv.length, data: kv }
        res.json(response)
    })

}