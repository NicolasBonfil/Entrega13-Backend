import mongoose from "mongoose";

const mesagesCollection = "messages"

const messagesSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const messagesModel = mongoose.model(mesagesCollection, messagesSchema)

export default messagesModel