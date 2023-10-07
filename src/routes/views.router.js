import { Router } from "express"
import messagesController from "../controllers/messages.controller.js"
import cartsController from "../controllers/carts.controller.js"
import productsModel from "../models/schemas/products.js"

const router = Router()

router.get("/", (req, res) => {
    res.render("login")
})

router.get("/messages", async (req, res) => {
    let messages = await messagesController.getAllMessages()
    res.render("chat", {messages})
})

router.get("/products", async (req, res) => {
    const {page = 1} = req.query
    const {docs, hasPrevPage, hasNextPage, nextPage, prevPage} = await productsModel.paginate({}, {limit: 2, page, lean: true})

    const products = docs

    res.render("products", {
        products,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
        user: req.session.user
    })
})


router.get("/loggerTest", (req, res) => {
    console.log("loggers");
    
    req.logger.debug("debug")
    req.logger.http("http")
    req.logger.info("info")
    req.logger.warning("warn")
    req.logger.error("error")
    req.logger.fatal("fatal")

    res.send("Loggers")
})

router.get("/logout", (req, res) => {
    res.send("Sesion cerrada correctamente")
})

router.get("/carts/:cid", cartsController.getCartProducts)

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.get("/resetPasswordEmail", (req, res) => {
    res.render("resetPasswordEmail")
})

router.get("/resetPassword", (req, res) => {
    res.render("resetPassword")
})

export default router
