import { Router } from "express"
import productController from "../controllers/products.controller.js"
import auth from "../middlewares/auth.middlewares.js"

class ProductRouter{
    constructor(){
        this.InicioProduct = Router()
        this.InicioProduct.get("/", productController.getProducts)
        this.InicioProduct.get("/mockingproducts", productController.mockingProducts)
        this.InicioProduct.get("/:id", productController.getProductById)
        this.InicioProduct.post("/", auth(["ADMIN", "PREMIUM"]), productController.addProduct)
        this.InicioProduct.put("/:pid", auth(["ADMIN", "PREMIUM"]), productController.updateProduct)
        this.InicioProduct.delete("/:pid", auth(["ADMIN", "PREMIUM"]),  productController.deleteProduct)
    }

    getRouter(){
        return this.InicioProduct
    }
}

export default new ProductRouter()