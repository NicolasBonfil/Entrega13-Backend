import EError from "../errors/num.js";

export default(error, req, res, next) => {
    switch (error.code) {
        case EError.NOT_FOUND:
            res.send({status: 'error', error: error.name, code: error.code, message: error.message, cause: error.cause})
            break;

        case EError.INVALID_TYPES_ERROR:
            res.send({status: 'error', error: error.name, code: error.code, message: error.message, cause: error.cause})
            break;

        case EError.DATABASE_ERROR:
            res.send({status: 'error', error: error.name, code: error.code, message: error.message, cause: error.cause})
            break;
    
        default:
            res.send({status: 'error', error: error.name, code: error.code, message: error.message, cause: error.cause})
            break;
    }
}
 