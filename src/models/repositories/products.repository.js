import customError from "../../errors/customError.js"
import { dataBaseError, existingProduct, missingDataError, nonexistentProduct } from "../../errors/info.js"
import EError from "../../errors/num.js"
import { generateProducts } from "../../utils/mocks.utils.js"
import productsDAO from "../daos/dbManagers/products.dao.js"

class ProductsRepository{
    async getProducts(limit, page, filtro, sort){
        try {
            return await productsDAO.getProducts(limit, page, filtro, sort)
        } catch (error) {
            customError.createError({
                name: "Error al obtener los productos",
                cause: dataBaseError(error),
                message: "Ocurrio un error en el servidor",
                code: EError.DATABASE_ERROR
            })
        }
    }

    async getProductById(id){
        try {
            return await productsDAO.getProductById(id)
        } catch (error) {
            if(!id){
                customError.createError({
                    name: "Error al obtener el producto",
                    cause: missingDataError("Id del producto"),
                    message: "La informacion del id del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            const products = await productsDAO.getLeanProducts()
            const existsProduct = products.find(p => p._id == id)
            if(!existsProduct){
                customError.createError({
                    name: "Error al obtener el producto",
                    cause: nonexistentProduct(id),
                    message: "Producto inexistente",
                    code: EError.NOT_FOUND
                })
            }

            customError.createError({
                name: "Error al obtener el producto",
                cause: dataBaseError(error),
                message: "Ocurrio un error en el servidor",
                code: EError.DATABASE_ERROR
            })
        }
    }

    async addProduct(product){
        try {
            return await productsDAO.addProduct(product)
        } catch (error) {
            const products = await productsDAO.getLeanProducts()

            if(!product){
                customError.createError({
                    name: "Error al agregar el producto",
                    cause: missingDataError("Producto"),
                    message: "La informacion del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!product.title){
                customError.createError({
                    name: "Error al agregar el producto",
                    cause: missingDataError("Nombre del producto"),
                    message: "La informacion del nombre del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!product.description){
                customError.createError({
                    name: "Error al agregar el producto",
                    cause: missingDataError("Descripción del producto"),
                    message: "La informacion de la descripcion producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!product.price){
                customError.createError({
                    name: "Error al agregar el producto",
                    cause: missingDataError("Precio del producto"),
                    message: "La informacion del precio del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!product.code){
                customError.createError({
                    name: "Error al agregar el producto",
                    cause: missingDataError("Codigo del producto"),
                    message: "La informacion del codigo del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!product.category){
                customError.createError({
                    name: "Error al agregar el producto",
                    cause: missingDataError("Categoria del producto"),
                    message: "La informacion de la categoria del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            const existsProduct = products.find(p => p.code == product.code)
            if(existsProduct){
                customError.createError({
                    name: "Error al agregar el producto",
                    cause: existingProduct(product.code),
                    message: "Ya existe un producto con ese codigo",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            customError.createError({
                name: "Error al agregar el producto",
                cause: dataBaseError(error),
                message: "Ocurrio un error en el servidor",
                code: EError.DATABASE_ERROR
            })
        }
    }

    async updateProduct(pid, datosActualizados){
        try {
            return await productsDAO.updateProduct(pid, datosActualizados)
        } catch (error) {
            if(!pid){
                customError.createError({
                    name: "Error al actualizar el producto",
                    cause: missingDataError("Id del producto"),
                    message: "La informacion del id del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!datosActualizados){
                customError.createError({
                    name: "Error al actualizar el producto",
                    cause: missingDataError("Datos del producto"),
                    message: "La informacion de los datos del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }
            const products = await productsDAO.getLeanProducts()
    
            const existsProduct = products.find(p => p.code == datosActualizados.code)
            if(existsProduct){
                customError.createError({
                    name: "Error al actualizar el producto",
                    cause: existingProduct(datosActualizados.code),
                    message: "Ya existe un producto con ese codigo",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            const product = products.find(p => p._id == pid)
            if(!product){
                customError.createError({
                    name: "Error al actualizar el producto",
                    cause: nonexistentProduct(pid),
                    message: "Producto inexistente",
                    code: EError.NOT_FOUND
                })
            }

            customError.createError({
                name: "Error al actualizar el producto",
                cause: dataBaseError(error),
                message: "Ocurrio un error en el servidor",
                code: EError.DATABASE_ERROR
            })
        }
    }

    async deleteProduct(pid){
        try {
            return await productsDAO.deleteProduct(pid)
        } catch (error) {
            if(!pid){
                customError.createError({
                    name: "Error al eliminar el producto",
                    cause: missingDataError("Id del producto"),
                    message: "La informacion del id del producto esta incompleta",
                    code: EError.INVALID_TYPES_ERROR
                })
            }
    
            const products = await productsDAO.getLeanProducts()
            const product = products.find(p => p._id == pid)
            if(!product){
                customError.createError({
                    name: "Error al eliminar el producto",
                    cause: nonexistentProduct(pid),
                    message: "Producto inexistente",
                    code: EError.NOT_FOUND
                })
            }

            customError.createError({
                name: "Error al eliminar el producto",
                cause: dataBaseError(error),
                message: "Ocurrio un error en el servidor",
                code: EError.DATABASE_ERROR
            })
        }
    }
    
    async mockingProducts(total) {
        try {
            const products = Array.from({length: total}, () => generateProducts())
            return products;
        } catch (error) {
            customError.createError({
                name: "Error al obtener los productos de prueba",
                cause: dataBaseError(error),
                message: "Ocurrio un error en el servidor",
                code: EError.DATABASE_ERROR
            })
        }
    }

}

export default new ProductsRepository()