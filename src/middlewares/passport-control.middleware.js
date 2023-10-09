import { SaveUserDTO } from "../models/dtos/user.dto.js"
import { HTTP_STATUS } from "../utils/responses.js"
import passport from "./passport.middleware.js"

const passportControl = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, {session:false}, async (error, user, info) => {
            if(error) next(error)
            if(!user) return res.status(HTTP_STATUS.UNAUTHORIZED).send({error: error ?? `${info}`})

            const userPayload = await new SaveUserDTO(user).getUser()
            req.user = userPayload

            next()
        })(req, res, next)
    }
}

export default passportControl