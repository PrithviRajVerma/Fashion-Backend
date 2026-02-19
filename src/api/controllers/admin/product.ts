import {asyncHandler} from "../../../utils/asyncHandler.ts";
import {string, z} from "zod";

export const CategoryRequery = z.object({
    name : string,
    slug : string
})




export const addProduct = asyncHandler(async (req,res,next) => {

})

export const addCategory = asyncHandler(async (req,res,next) => {

})