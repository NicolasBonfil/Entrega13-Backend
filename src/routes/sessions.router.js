import { Router } from "express"
import userModel from "../models/schemas/Users.model.js"
import passport from "passport"
import { generateToken } from "../utils/token.js"
import { createHash } from "../utils/password.js"
import passportControl from "../middlewares/passport-control.middleware.js"
import auth from "../middlewares/auth.middlewares.js"
import { HTTP_STATUS, successResponse } from "../utils/responses.js"
import EError from "../errors/num.js"
import customError from "../errors/customError.js"
import { missingDataError } from "../errors/info.js"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const authMid = [
    passportControl("jwt"),
    auth("user")
]

const router = Router()

router.post("/register", passport.authenticate("register", {passReqToCallback: true, session: false, failureRedirect: "/api/session/failedRegister", failureMessage: true}), (req, res) => {
    res.status(HTTP_STATUS.OK).send({status: "success", message: "Usuario registrado", payload: req.user._id})
})

router.post("/login", passport.authenticate("login", {passReqToCallback: true, session: false, failureRedirect: "/api/session/failedLogin", failureMessage: true}), (req, res) => {
    const user = req.user
    const access_token = generateToken(user)

    res.cookie("CoderCookie", access_token, {
        maxAge: 60*60*1000,
        httpOnly: true
    })

    res.status(HTTP_STATUS.OK).send({status:"success", payload: user})
})

router.get("/failedRegister", (req, res) => {
    res.status(HTTP_STATUS.SERVER_ERROR).send({message: "Failed register"})
})

router.get("/failedLogin", (req, res) => {
    res.status(HTTP_STATUS.SERVER_ERROR).send({message: "Failed login"})
})

router.post("/resetPassword", (req, res) => {
    const {password, passwordConfirm} = req.body

    if(password !== passwordConfirm){
        return res.send({error: "error"})
    }

    if(!password || !passwordConfirm){
        customError.createError({
            name: "Error al resetear la contraseña",
            cause: missingDataError("Contraseña"),
            message: "La informacion de la contraseña esta incompleta",
            code: EError.INVALID_TYPES_ERROR
        })
    }

    const token = req.cookies["PasswordToken"]
    console.log(token);

    res.clearCookie("PasswordToken")

    jwt.verify(token, "c0d3rs3cr3t", async (err, decoded) => {
        if(err){
            console.log(err);
        }

        const userId = decoded.user;

        const user = await userModel.findOne({email: userId})

        const match = await bcrypt.compare(password, user.password);

        if(match){
            return res.send({error: "error"})
        }

        user.password = createHash(password)

        const result = await userModel.updateOne({email:userId}, user)

        const response = successResponse(result)
        res.status(HTTP_STATUS.OK).send(response)
    })
})

router.post("/resetPasswordEmail", async (req, res) => {
    const {email} = req.body
    if(!email){
        customError.createError({
            name: "Error al resetear la contraseña",
            cause: missingDataError("Usuario"),
            message: "La informacion del usuario esta incompleta",
            code: EError.INVALID_TYPES_ERROR
        })
    }

    const user = await userModel.findOne({email})
    if(!user){
        customError.createError({
            name: "Error al resetear la contraseña",
            cause: "No existe un usuario con ese email",
            message: "Usuario inexistente",
            code: EError.NOT_FOUND
        })
    }
    
    const token = generateToken(email)
    
    res.cookie("PasswordToken", token, {
        maxAge: 60*60*1000,
        httpOnly: true
    })

    const transport = nodemailer.createTransport({
        service: "gmail",
        port: 587,
        auth: {
            user: "bonfil.nico@gmail.com",
            pass: "vohcftbednjfztsj"
        }
    })

    const mailParams = {
        from: "bonfil.nico@gmail.com",
        to: email,
        subject: "Restablecer Contraseña",
        html: `<div>
            <p>Para restablecer tu contraseña, haz clic en el siguiente enlace: </p>
            <a href="http://localhost:8080/resetPassword">Reset Password</a><
        </div>`,
    }

    transport.sendMail(mailParams, (error, info) => {
        if (error) {
        console.log(error);
        } else {
        console.log("Correo enviado:  " + info.response);
        } 
    });

    res.send({"success": true})
})


router.get("/github", passport.authenticate("github", {scope: ["user: email"]})),async (req, res) => {
    res.status(HTTP_STATUS.OK).send("Usuario logueado con GitHub")
}

router.get("/githubCallback", passport.authenticate("github", {failureRedirect: "/login"})),async (req, res) => {
    req.session.user = req.user
    res.redirect("/products")
}


router.post("/logout", (req, res, next) => {        
        try {
            if(req.session){
                req.session.destroy(err => {
                    if(err){
                        return next(err)
                    }
                })
            }
            res.clearCookie("CoderCookie")
            res.status(HTTP_STATUS.OK).send("Logout")
        } catch (error) {
            next(error)
        }
    
})

router.get("/current", authMid, async (req, res) => {
    const user = req.user
    console.log(user);
    res.render("current", {user})
})

export default router