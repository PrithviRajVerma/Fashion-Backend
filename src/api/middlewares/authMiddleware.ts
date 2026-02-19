import {type UserRole} from "../enum/role.ts";
import {asyncHandler} from "../../utils/asyncHandler.ts";
import {ApiError} from "../../utils/ApiError.ts";


export const requiredRole = (allowedRoles : UserRole[]) =>
    asyncHandler(async (req, res, next) => {

        if(!req.user){
            throw ApiError.unauthorized("Unauthorized User");
        }

        if(!allowedRoles.includes(req.user.role)){
            throw ApiError.forbidden("Permission Denied");
        }
        next();
    })
