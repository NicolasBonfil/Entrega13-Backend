import dotenv from "dotenv"

dotenv.config()

const CONFIG = {
    MONGO_URL: process.env.MONGO_URL || "",
    PORT: process.env.PORT || "3000",
    SECRET_KEY: process.env.SECRET_KEY || ""
}

export default CONFIG