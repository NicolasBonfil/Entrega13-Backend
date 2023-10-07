import customError from "../../errors/customError.js";
import { dataBaseError, existingTicket, missingDataError } from "../../errors/info.js";
import EError from "../../errors/num.js";
import ticketDao from "../daos/dbManagers/ticket.dao.js"; 

class TicketRepository{
    async createTicket(email, amount){
        try {
            return await ticketDao.createTicket(email, amount)
        } catch (error) {
            if(!email){
                customError.createError({
                    name: "Error al crear el ticket",
                    cause: missingDataError("Email"),
                    message: "La informacion del email no esta completa",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            if(!amount){
                customError.createError({
                    name: "Error al crear el ticket",
                    cause: missingDataError("Precio total"),
                    message: "La informacion del precio total no esta completa",
                    code: EError.INVALID_TYPES_ERROR
                })
            }

            customError.createError({
                name: "Error al crear el ticket",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
            
        }
    }

    async getTickets(code){
        try {
            return await ticketDao.getTicket(code)   
        } catch (error) {
            customError.createError({
                name: "Error al obtener los tickets",
                cause: dataBaseError(error),
                message: error.message,
                code: EError.DATABASE_ERROR
            })
        }
    }
}

export default new TicketRepository()