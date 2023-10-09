import { Router } from "express"
import messagesController from "../controllers/messages.controller.js"

const router = Router()
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


router.get("/", (req, res) => {
    res.render("login")
})

router.get("/register", (req, res) => {
    res.render("register")
})

router.get("/resetPasswordEmail", (req, res) => {
    res.render("resetPasswordEmail")
})

router.get("/resetPassword", (req, res) => {
    res.render("resetPassword")
})

router.get("/messages", async (req, res) => {
    let messages = await messagesController.getAllMessages()
    res.render("chat", {messages})
})

export default router
