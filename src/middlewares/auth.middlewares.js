import { HTTP_STATUS } from "../utils/responses.js";

const auth = (roles) => {
	return async(req, res, next) => {
		if(!req.user){
			return res.status(HTTP_STATUS.UNAUTHORIZED).json({error: "No authenticated"})
		}
		
		if(!roles.includes(req.user.role.toUpperCase())){
			return res.status(HTTP_STATUS.FORBIDDEN).json({error: "Access Denied"})
		}
		next();
	}
};

export default auth