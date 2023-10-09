import { Router } from "express"
import cartController from "../controllers/carts.controller.js"
import auth from "../middlewares/auth.middlewares.js"


class CartRouter{
    constructor(){
        this.InicioCart = Router()
        this.InicioCart.get("/", cartController.getCartProducts)
        this.InicioCart.post("/", auth(["BASIC", "PREMIUM"]), cartController.createCart)
        this.InicioCart.post("/:cid/products/:pid", auth(["BASIC", "PREMIUM"]), cartController.addProductToCart)
        this.InicioCart.delete("/:cid/products/:pid", cartController.removeProductFromCart)
        this.InicioCart.put("/:cid", cartController.updateCartProducts)
        this.InicioCart.put("/:cid/products/:pid", cartController.updateProductQuantity)
        this.InicioCart.delete("/:cid", cartController.deleteCartProducts)

        this.InicioCart.post("/finalizarCompra", cartController.finalizarCompra)
    }

    getRouter(){
        return this.InicioCart
    }
}

export default new CartRouter()