import mongoose from "mongoose";

const cartsCollection = "carts"

const cartsSchema = new mongoose.Schema({
    productsInCart: {
        type: [
            {
                quantity: Number,
                product:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products"
                }
            }
        ],
        required: true,
        default: []
    }
})

const cartsModel = mongoose.model(cartsCollection, cartsSchema)
export default cartsModel