import winston from "winston"

const levelOptions = {
    levels:{
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
    },
    colors:{
        debug: "whiteBG",
        http: "greenBG",
        info: "blueBG",
        warning: "yellowBG",
        error: "blackBG",
        fatal: "redBG"
    }
}

const logger = winston.createLogger({
    levels: levelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: "fatal",
            format: winston.format.combine(
                winston.format.colorize({colors: levelOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: "../errors.log",
            level: "error",
            format: winston.format.simple()
        })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = logger
    next()
}