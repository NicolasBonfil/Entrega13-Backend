import userModel from "../models/schemas/Users.model.js"
import { generateToken } from "../utils/token.js"
import { createHash } from "../utils/password.js"
import { HTTP_STATUS, successResponse } from "../utils/responses.js"
import EError from "../errors/num.js"
import customError from "../errors/customError.js"
import { missingDataError } from "../errors/info.js"
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

class SessionsController{
    async register (req, res, next){
        try {
            const result = successResponse(req.user._id)
            res.status(HTTP_STATUS.OK).send({status: "success", message: "Usuario registrado", result})
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next){
        try {
            const user = req.user
            const access_token = generateToken(user)

            res.cookie("CoderCookie", access_token, {
                maxAge: 60*60*1000,
                httpOnly: true
            })

            const result = successResponse(user)
            res.status(HTTP_STATUS.OK).send({status:"success", result})
        } catch (error) {
            next(error)
        }
    }

    async logout(req, res, next){        
        try {
            if(req.session){
                req.session.destroy(err => {
                    if(err){
                        return next(err)
                    }
                })
            }
            res.clearCookie("CoderCookie")
            res.status(HTTP_STATUS.OK).send({status: "success", message: "Logout successfull"})
        } catch (error) {
            next(error)
        }
    }

    async resetPasswordEmail(req, res, next){
        const {email} = req.body
        if(!email){
            customError.createError({
                name: "Error al resetear la contraseña",
                cause: missingDataError("Usuario"),
                message: "Debes completar la informacion",
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
                <a href="http://localhost:8080/resetPassword"> Reset Password </a>
            </div>`,
        }

        transport.sendMail(mailParams, (error, info) => {
            if (error) {
                customError.createError({
                    name: "Error al enviar el mail",
                    cause: "Internal Server Error",
                    message: "Ha ocurrido un error en el servidor",
                    code: EError.DATABASE_ERROR
                })
            }
            
            const result = successResponse(info)
            return res.status(HTTP_STATUS.OK).send({status: "success", result});
        });
    }

    async resetPassword(req, res, next){
        const {password, passwordConfirm} = req.body

        if(password !== passwordConfirm){
            customError.createError({
                name: "Error al cambiar la contraseña",
                cause: "Las contraseñas no coniciden",
                message: "Las contraseñas no coinciden",
                code: EError.DATABASE_ERROR
            })
        }

        if(!password || !passwordConfirm){
            customError.createError({
                name: "Error al cambiar la contraseña",
                cause: missingDataError("Contraseña"),
                message: "Debes completar la informacion",
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
    }
}

export default new SessionsController()