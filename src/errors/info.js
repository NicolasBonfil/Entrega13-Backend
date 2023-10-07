export const missingDataError = (dato) => {
    return `Las siguiente propiedad no esta completa: ${dato}`
}

export const nonExistentCart = (cid) => {
    return `Carrito no encontrado:
            Id recibido: ${cid}`
}

export const nonexistentProduct = (pid) => {
    return `Producto no encontrado:
            Id recibido: ${pid}`
}

export const existingProduct = (code) => {
    return `Ya existe un producto con el codigo: ${code}`
}

export const existingTicket = (code) => {
    return `Ya existe un ticket con el codigo: ${code}`
}

export const dataBaseError = (error) => {
    return `Ocurrio el siguiente error: ${error}`
}

export const invalidData = (data) => {
    return `La siguiente data es invalida: ${data}`
} 