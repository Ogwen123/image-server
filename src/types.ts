export module types {
    export type ImageData = {
        code: string,
        fileType: string,
        fileName: string,
        fileNameWithoutDate: string,
        filePath: string,
        originalName: string
    }

    export type FileDataToPrint = {
        code: string,
        type: string,
        path: string,
        filename: string
    }

    export type FindImageReturn = {
        found: boolean,
        path?: string,
        data?: ImageData
    }
}