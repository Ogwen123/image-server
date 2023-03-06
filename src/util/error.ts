export function error(code: number, error: string, message: string, res: any) {
    res.status(code).json({ code: code, error: error, message: message })
}