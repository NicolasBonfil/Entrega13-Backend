import { Router } from "express"
import productsRouter from "./products.router.js"
import cartsRouter from "./carts.router.js"
import messagesRouter from "./messages.router.js"
import sessionRouter from "./sessions.router.js"
import passportControl from "../middlewares/passport-control.middleware.js"
import userModel from "../models/schemas/Users.model.js"

const router = Router()

router.use("/products", productsRouter.getRouter())
router.use("/carts", cartsRouter.getRouter())
router.use("/messages", messagesRouter.getRouter())
router.use("/session", sessionRouter)

router.get("/users/premium", passportControl("jwt"), async (req, res) => {
    const user = await userModel.findOne({email: req.user.email})
    user.role = "Premium"
    await userModel.updateOne({email: req.user.email}, user)
    req.user = user
    res.send({success: true, message: "Te convertiste en usuario premium"})
})

export default router