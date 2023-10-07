import { HTTP_STATUS } from "../utils/responses.js"

const EError = {
    NOT_FOUND: HTTP_STATUS.NOT_FOUND,
    INVALID_TYPES_ERROR: HTTP_STATUS.BAD_REQUEST,
    DATABASE_ERROR: HTTP_STATUS.SERVER_ERROR
}

export default EError