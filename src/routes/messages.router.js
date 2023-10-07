import { Router } from "express"
import messageController from "../controllers/messages.controller.js"
import passportControl from "../middlewares/passport-control.middleware.js"
import auth from "../middlewares/auth.middlewares.js"

const authMidUser = [
    passportControl("jwt"),
    auth("user")
]

class MessageRouter{
    constructor(){
        this.InicioMessage = Router()
        this.InicioMessage.post("/", authMidUser, messageController.saveMessages)
    }

    getRouter(){
        return this.InicioMessage
    }
}

export default new MessageRouter()