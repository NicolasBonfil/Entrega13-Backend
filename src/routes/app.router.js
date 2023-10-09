import { Router } from "express"
import productsRouter from "./products.router.js"
import cartsRouter from "./carts.router.js"
import messagesRouter from "./messages.router.js"
import sessionRouter from "./sessions.router.js"
import usersRouter from "./users.router.js"
import passportControl from "../middlewares/passport-control.middleware.js"

const router = Router()

router.use("/products", passportControl("jwt"), productsRouter.getRouter())
router.use("/carts", passportControl("jwt"), cartsRouter.getRouter())
router.use("/messages", passportControl("jwt"), messagesRouter.getRouter())
router.use("/users", passportControl("jwt"), usersRouter.getRouter())
router.use("/session", sessionRouter)

export default router