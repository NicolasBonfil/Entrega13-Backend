import passport from "passport"
import local from "passport-local"
import userModel from "../models/schemas/Users.model.js"
import { createHash, isValidPassword } from "../utils/password.js"
import GitHubStrategy from "passport-github2"

const LocalStrategy = local.Strategy

const initializePassport = async () => {
    passport.use("register", new LocalStrategy({passReqToCallback: true, usernameField: "email", session: false},
    async (req, email, password, done) => {
        try {
            const {first_name, last_name} = req.body
            if(!first_name || !last_name) return done(null, false, {message: "Faltan datos"})
            const exists = await userModel.findOne({email})
            if(exists) return done(null, false, {message: "Usuario existente"})

            const hashPassword = await createHash(password)

            const newUser = {
                first_name,
                last_name,
                email,
                password: hashPassword
            }

            let result = await userModel.create(newUser)
            done(null, result)
        } catch (error) {
            done(error)
        }
    }))

    passport.use("login", new LocalStrategy({passReqToCallback: true, usernameField: "email", session: false},
    async(req, email, password, done) => {
        try {
            let user;
            if(email === "admincoder@gmail.com" && password == "soyadmincoder"){
                user = {
                    first_name: "Admin",
                    last_name: "Coder",
                    email: "admincoder@gmail.com",
                    password: "soyadmincoder",
                    role: "admin"
                }
            }else{
                user = await userModel.findOne({email})
                if(!user) return done(null, false, {message: "Usuario inexistente"})
                user.role = "user"
                const validatePassword = await isValidPassword(user, password)
                if(!validatePassword) return done(null, false, {message: "Contraseña incorrecta"})
            }



            return done(null, user)

        } catch (error) {
            return done(error)
        }
    }))

    passport.use("github", new GitHubStrategy(
        {
            clientID: "Iv1.47d06ec4d1158dbe",
            clientSecret: "736197931b21dd71e41b5c03a233e0849cd1c676",
            callbackURL: "http://localhost:8080/api/session/githubcallback"
        },
        
        async(accessToken, refreshToken, profile, done) => {
            try {
                let user = await userModel.findOne({email: profile._json.email})
    
                if(!user){
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: "",
                        email: profile._json.email,
                        age: "",
                        password: ""
                    }
                    let result = await userModel.create(newUser)
                    done(null, result)
                }else{
                    done(null, user)
                }
    
            } catch (error) {
                return done(error)
            }
        }
    ))
    

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        let result = await userService.getById({id: id})
        return done(null, result)
    })
}

export default initializePassport