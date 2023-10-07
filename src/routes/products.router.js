import { Router } from "express"
import productController from "../controllers/products.controller.js"
import auth from "../middlewares/auth.middlewares.js"
import passportControl from "../middlewares/passport-control.middleware.js"

const authMidAdmin = [
    passportControl("jwt"),
    auth("admin")
]

const authMidUser = [
    passportControl("jwt"),
    auth("user")
]

class ProductRouter{
    constructor(){
        this.InicioProduct = Router()
        this.InicioProduct.get("/", passportControl("jwt"), productController.getProducts)
        this.InicioProduct.get("/mockingproducts", productController.mockingProducts)
        this.InicioProduct.get("/:id", productController.getProductById)
        this.InicioProduct.post("/", authMidAdmin, productController.addProduct)
        this.InicioProduct.put("/:pid", authMidAdmin, productController.updateProduct)
        this.InicioProduct.delete("/:pid", authMidAdmin,  productController.deleteProduct)
    }

    getRouter(){
        return this.InicioProduct
    }
}

export default new ProductRouter()