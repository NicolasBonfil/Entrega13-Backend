import passport from "passport"
import passportJwt from "passport-jwt"
import {cookieExtractor} from "../utils/token.js"
import CONFIG from "../config/config.js"

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

const {SECRET_KEY} = CONFIG

passport.use("jwt", new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY
    },
    async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }
))
export default passport