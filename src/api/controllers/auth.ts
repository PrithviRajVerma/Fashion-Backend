import {asyncHandler} from "../../utils/asyncHandler.ts";
import {z} from "zod";

const userCred = z.object({
    email: z.string().email(),
    password: z.string().nonempty()
})

export const registerViaEmail = asyncHandler(async (req, res) => {

})

export const loginViaEmail = asyncHandler(async (req, res) => {

})

export const loginViaOIDC = asyncHandler(async (req, res) => {
    req.session
})