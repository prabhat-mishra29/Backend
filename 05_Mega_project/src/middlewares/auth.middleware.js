//What is the work of this middleware?
//  This will verify that the user is present or not?
//  When you loggin a user , you give access and refresh tokens to the user.In the basis of that we will verify the user.
// If you have the correct access and refresh tokens, we will add a new object (req.user) to "req.body".

import { APIerror } from "../utils/APIerror.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,_,next) => {
        //We use "_" for response because we do not make use of it here.
        try {
            //How to access tokens?:-
                //Request have tokens.
            const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
            //                               [For mobile applications, we send cookies in the header file.]
            // originates from either cookies or custom headers.
            // Usually , we have an "authorization" header.
            // Go to the postman and see the header file. We will find a key with a value.
            // (key)Authorization:(value)Bearer <token>
            // Authorization header using the Bearer schema.We need only token so we replace "Bearer " with "".
            // Why do we use access token ? why not refresh token?
                // We will deal with this later.

            if (!token) {
                throw new APIerror(401, "Unauthorized request")
            }
            
            console.log(token);

            //If present then ask jwt to decode token using token_secret.
            //Without token_secret we can not decode it.
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
            console.log(decodedToken);//data coming from the token.

            const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        
            if (!user) {
                //next_video:discuss about frontend.
                throw new APIerror(401, "Invalid Access Token")
            }
        
            //User present hai toh new object create karo..
            req.user = user;
            //  varibale [ you can set req.hites=user as your wish ]
            next()
        }
        catch (error) {
            throw new APIerror(401, error?.message || "Invalid access token")
        }
    }
)

//After creating the middleware, proceed to the user.routes to inject it.