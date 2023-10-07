import mongoose from "mongoose";

const ticketCollection = "ticket"

let today = new Date().toLocaleDateString()
let time = new Date().toLocaleTimeString()

const ticketSchema = new mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_date:{
        type: String,
        default: today
    },
    purchase_time:{
        type: String,
        default: time
    },
    amount: {
        type: Number,
        default: 1
    },
    purchaser:{
        type : String
    }
})

const ticketModel = mongoose.model(ticketCollection, ticketSchema)

export default ticketModel