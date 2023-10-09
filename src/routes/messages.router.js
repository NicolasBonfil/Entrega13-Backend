import { Router } from "express"
import messageController from "../controllers/messages.controller.js"
import auth from "../middlewares/auth.middlewares.js"

class MessageRouter{
    constructor(){
        this.InicioMessage = Router()
        this.InicioMessage.post("/", auth(["BASIC", "PREMIUM"]), messageController.saveMessages)
    }

    getRouter(){
        return this.InicioMessage
    }
}

export default new MessageRouter()