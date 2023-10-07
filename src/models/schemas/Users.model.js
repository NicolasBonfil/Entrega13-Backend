import mongoose from "mongoose"

const userCollection = "users"

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    role: {
        type: String,
        enum: ["user", "admin", "premium"], // Define los valores permitidos
        default: "user" // Valor predeterminado si no se especifica
      },
    cart: {}
})

const userModel = mongoose.model(userCollection, userSchema)
export default userModel