import productRepository from "../models/repositories/products.repository.js"
import { HTTP_STATUS, HttpError, successResponse } from "../utils/responses.js";

class ProductController{
    async getProducts(req, res, next){
        const {limit = 10} = req.query
        const {page = 1} = req.query

        let filtro = {};

        if(req.query.status == "true"){
            filtro = {status: true}
        }else if(req.query.status == "false"){
            filtro = {status: false}
        }else if(req.query.category){
            filtro = {category: req.query.category}
        }

        const sort = req.query.sort

        try {
            const result = await productRepository.getProducts(limit, page, filtro, sort)
            const response = successResponse(result)
            res.status(HTTP_STATUS.OK).send(response) 
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }

    async getProductById(req, res, next){
        const id = req.params.id
        try {
            const product = await productRepository.getProductById(id)
            const response = successResponse(product)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }

    async addProduct(req, res, next){
        const {title, description, price, code, stock, category, thumbnail} = req.body
    
        try {
            let product = {
                title,
                description,
                price,
                code,
                stock,
                category,
                thumbnail
            }
        
            const newProduct = await productRepository.addProduct(product)
            const response = successResponse(newProduct)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }

    async updateProduct(req, res, next){
        const pid = req.params.pid
        const datosActualizados = req.body
    
        try {
            const productoActualizado = await productRepository.updateProduct(pid, datosActualizados)
            const response = successResponse(productoActualizado)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }

    async deleteProduct(req, res, next){
        const pid = req.params.pid
        try {
            const productoEliminado = await productRepository.deleteProduct(pid)
            const response = successResponse(productoEliminado)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }

    async mockingProducts(req, res, next) {
        try {
            const total = req.query.total || 100
            let result = await productRepository.mockingProducts(total)
            const response = successResponse(result)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    }

}

export default new ProductController()