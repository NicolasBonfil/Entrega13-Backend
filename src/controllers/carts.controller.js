import cartsRepository from "../models/repositories/carts.repository.js"
import { HTTP_STATUS, HttpError, successResponse } from "../utils/responses.js"
import usersModel from "../models/schemas/Users.model.js"
import ticketModel from "../models/schemas/ticket.js"
import productsRepository from "../models/repositories/products.repository.js"
import userModel from "../models/schemas/Users.model.js"
import ticketRepository from "../models/repositories/ticket.repository.js"


class CartController{
    async getCartProducts(req, res, next){
        try {
            const products = await cartsRepository.getCartProducts(req.user.cart._id)
            
            const response = successResponse(products)
            return res.status(HTTP_STATUS.OK).render("carts", {products})
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async createCart(req, res, next){
        try {
            const usuario = await usersModel.findOne({email: req.user.email})

            const newCart = await cartsRepository.createCart(usuario.cart)

            await usersModel.updateOne({email: req.user.email}, {$set: {cart: newCart}})

            const response = successResponse(newCart)
            res.status(HTTP_STATUS.CREATED).send(response)
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async addProductToCart(req, res, next){
        const cid = req.params.cid
        const pid = req.params.pid

        try {
            const addedProduct = await cartsRepository.addProductToCart(cid, pid)

            await usersModel.updateOne({email: req.user.email}, {$set: {cart: addedProduct}})

            const response = successResponse(addedProduct)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async removeProductFromCart (req, res, next){
        const cid = req.params.cid
        const pid = req.params.pid

        try {
            const removedProduct = await cartsRepository.removeProductFromCart(cid, pid)
            const response = successResponse(removedProduct)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async updateCartProducts(req, res, next){
        const cid = req.params.cid
        const products = req.body

        try {    
            const updatedProducts = await cartsRepository.updateCartProducts(cid, products)
            const response = successResponse(updatedProducts)
            res.status(HTTP_STATUS.OK).send(response)

        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async updateProductQuantity(req, res, next){
        const cid = req.params.cid
        const pid = req.params.pid
        const {quantity} = req.body

        try {
            const updatedQuantity = await cartsRepository.updateProductQuantity(cid, pid, quantity);
            const response = successResponse(updatedQuantity)
            res.status(HTTP_STATUS.OK).send(response);   
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    async deleteCartProducts(req, res, next){
        const cid = req.params.cid

        try {
            const removedProducts = await cartsRepository.deleteCartProducts(cid)
            const response = successResponse(removedProducts)
            res.status(HTTP_STATUS.OK).send(response)
        } catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }

    
    async finalizarCompra(req, res, next){
        const purchased = []
        const notPurchased = []
        
        const products = req.user.cart.productsInCart
        
        async function filtrar(){
            for(let p of products){
                try {
                    const product = await productsRepository.getProductById(p.product)
                    if(product.stock < p.quantity){
                        notPurchased.push({product: p.product, quantity: p.quantity})
                    }else{
                        purchased.push({product: product, quantity: p.quantity})
                        await cartsRepository.removeProductFromCart(req.user.cart._id, p.product)
                    }
                } catch (error) {
                    return new HttpError("Error al actualizar el carrito", HTTP_STATUS.BAD_REQUEST)
                }

            }
        }

        await filtrar()
        
        
        const amount = purchased.reduce( (acc, p) => {
            return (acc + p.product.price * p.quantity)
        }, 0)
        
        try{
            
            if(amount > 0){
                const user = await userModel.findOne({email: req.user.email})
                user.cart.productsInCart = notPurchased
                await userModel.updateOne({email: req.user.email}, user)

                const ticket = await ticketRepository.createTicket(req.user.email, amount)
                const response = successResponse(ticket)

                return res.status(HTTP_STATUS.CREATED).send(response)
            }
        }catch (error){
            req.logger.error(error.message)
            next(error)
        }
    }
}

export default new CartController()