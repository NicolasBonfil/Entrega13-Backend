import { Router } from "express"
import cartController from "../controllers/carts.controller.js"
import passportControl from "../middlewares/passport-control.middleware.js"
import auth from "../middlewares/auth.middlewares.js"

const authMidUser = [
    passportControl("jwt"),
    auth("user")
]

class CartRouter{
    constructor(){
        this.InicioCart = Router()
        this.InicioCart.get("/", passportControl("jwt"), cartController.getCartProducts)
        this.InicioCart.post("/", authMidUser, cartController.createCart)
        this.InicioCart.post("/:cid/products/:pid", authMidUser, cartController.addProductToCart)
        this.InicioCart.delete("/:cid/products/:pid", cartController.removeProductFromCart)
        this.InicioCart.put("/:cid", cartController.updateCartProducts)
        this.InicioCart.put("/:cid/products/:pid", cartController.updateProductQuantity)
        this.InicioCart.delete("/:cid", cartController.deleteCartProducts)

        this.InicioCart.post("/finalizarCompra", passportControl("jwt"), cartController.finalizarCompra)
    }

    getRouter(){
        return this.InicioCart
    }
}

export default new CartRouter()