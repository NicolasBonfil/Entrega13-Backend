import jwt from "jsonwebtoken"
import CONFIG from "../config/config.js"

const {SECRET_KEY} = CONFIG

export const generateToken = (user) => {
    const token = jwt.sign({user}, SECRET_KEY, { expiresIn: '24h' })
    return token;
};
  
export const cookieExtractor = (req) => {
    let token = null
    if(req && req.cookies){
        token = req.cookies["CoderCookie"]
    }
    return token
}