import customError from "../../errors/customError.js"
import { dataBaseError, missingDataError } from "../../errors/info.js"
import EError from "../../errors/num.js"
import messagesDAO from "../daos/dbManagers/messages.dao.js"

class MessagesRepository{
    async getAllMessages(){
        try {
            return await messagesDAO.getAllMessages()
        } catch (error) {
            return customError.createError({
                name: "Error al obtener los mensajes",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }

    async saveMessages(user, message){
        try {
            return await messagesDAO.saveMessages(user, message)
        } catch (error) {
            if(!user){
                return customError.createError({
                    name: "Error al crear un mensaje",
                    cause: missingDataError("Nombre de usuario"),
                    message: "La informacion del nombre de usuario no esta completa",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!message){
                return customError.createError({
                    name: "Error al crear un mensaje",
                    cause: missingDataError("Mensaje"),
                    message: "La informacion del mensaje no esta completa",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            return customError.createError({
                name: "Error al crear un mensaje",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }
}

export default new MessagesRepository()