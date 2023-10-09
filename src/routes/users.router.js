import { Router } from "express"
import usersController from "../controllers/users.controller.js"
import auth from "../middlewares/auth.middlewares.js"

class UsersRouter{
    constructor(){
        this.InicioUser = Router()

        this.InicioUser.get("/profile", auth(["BASIC", "PREMIUM", "ADMIN"]), usersController.profile)
        this.InicioUser.get("/premium", auth(["BASIC", "PREMIUM"]), usersController.changeRole)
    }

    getRouter(){
        return this.InicioUser
    }
}

export default new UsersRouter()