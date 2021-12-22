export const Logger = (message: string, func: string, module: string) => {

    let now = new Date()

    console.log(`${now.toUTCString()} - ${module} - ${func} --- ${message}`)
}