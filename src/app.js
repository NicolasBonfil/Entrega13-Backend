import express from "express"
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import { Server } from "socket.io"
import passport from "passport"
import cookieParser from "cookie-parser"

import __dirname from "./dirname.js"
import viewRouter from "./routes/views.router.js"
import appRouter from "./routes/app.router.js"
import initializePassport from "./config/passport.config.js"
import CONFIG from "./config/config.js"
import errorMiddle from "./middlewares/indexControlError.js"
import { addLogger } from "./utils/logger.js"
import session from "express-session"

import swaggerJsdoc from "swagger-jsdoc"
import swaggerUIExpress from "swagger-ui-express"


const app = express()

mongoose.set("strictQuery", false)

const {PORT, MONGO_URL} = CONFIG

const connection = mongoose.connect(MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ecommerce"
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))


app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Documentacion de las APIs",
            description: "Informacion de los productos, carritos, mensjaes y de usuarios",
            version: "1.0.0",
            contact: {
                name: "Nicolas Bonfil",
                url: "www.linkedin.com/in/nicolas-bonfil-8a9783219/"
            }
        }
    },
    //apis: [`${process.cwd()}/src/docs/*.yaml`],
    //apis: [`${__dirname}/docs/**/*yaml`]
    apis: ["./docs/*.yaml"]
}

const spec = swaggerJsdoc(swaggerOptions)


app.use(cookieParser())
app.use(errorMiddle)
app.use(addLogger)

app.use("/api", appRouter)
app.use("/", viewRouter)
app.use("/apidocs", swaggerUIExpress.serve, swaggerUIExpress.setup(spec))

initializePassport(passport)
app.use(passport.initialize())
app.use(session({
    // store: MongoStore.create({
    //     mongoUrl: "mongodb+srv://bonfilnico:12345@pruebacoder.q69nl8a.mongodb.net/?retryWrites=true&w=majority",
    //     mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
    //     ttl:3600
    // }),
    secret: "12345abcd",
    resave: false,
    saveUninitialized: true
}))

const httpserver = app.listen(PORT, () => console.log("Server arriba"))
const socketServer = new Server(httpserver)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente");
})

export default socketServer