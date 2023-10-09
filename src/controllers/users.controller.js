import { generateToken } from "../utils/token.js"

class UsersController{
    async profile(req, res, next){
        const user = req.user 
        res.render("current", {user})
    }

    async changeRole(req, res, next){

        if(req.user.role === "BASIC"){
            req.user.role = "PREMIUM"
        }else{
            req.user.role = "BASIC"
        }

        const access_token = generateToken(req.user)
        res.cookie("CoderCookie", access_token, {
            maxAge: 60*60*1000,
            httpOnly: true
        })

        res.send(`Se ha en convertido en un usuario: ${req.user.role}`)
    }
}

export default new UsersController()