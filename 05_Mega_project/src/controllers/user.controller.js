import asyncHandler from "../utils/asyncHandler.js";

//Create a register method:-
    const registerUser = asyncHandler( async(req,res)=>{
        //usually we send a status and a json of response.
        //json is for frontend purpose.
        //you can use return or you can not use return here.
        return res.status(200).json(
            {
                message:"chai aur code"
            }
        )
    } )

    export {registerUser}