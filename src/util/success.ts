export function success(message: string): string {
    return JSON.stringify({
        message: message,
        code: 200
    })
}