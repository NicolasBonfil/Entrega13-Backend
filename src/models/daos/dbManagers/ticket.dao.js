import { generateCode } from "../../../utils/mocks.utils.js";
import ticketModel from "../../schemas/ticket.js";

class TicketDAO{
    getTicket = async(code) => {
        const ticket = await ticketModel.findOne({code: code});
        return ticket
    }

    createTicket = async(email, amount) => {
        let code = generateCode()

        const existsTicket = await this.getTicket(code)

        while(existsTicket){
            code = generateCode()
        }

        const ticket = {
            code: code,
            amount: amount,
            purchaser: email
        }

        let result = await ticketModel.create(ticket)
        return result
    }
}

export default new TicketDAO()