import kv from "./kv.json" assert { type: "json" }

type imageData = {
    code: string,
    fileType: string,
    fileName: string,
    filePath: string
}

type returnValue = {
    found: boolean,
    path?: string
}

export function findPath(image_code: string): returnValue {
    let path: string = "";

    kv.forEach((image: imageData) => {
        if (image.code === image_code) {
            path = image.filePath
        }
    })

    return { found: (path ? true : false), path: (path ? path : undefined) }
}