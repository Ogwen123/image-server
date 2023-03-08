import kv from "../../kv.json" assert { type: "json" }

export function all(req: Request | any, res: Request | any) {
    res.status(200)
    const response = { code: 200, success: true, total_images: kv.length, data: kv }
    res.json(response)
}