import {Router} from "express"
import { changeCurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";


const router=Router();

/*
    router.route("/register").post(registerUser);
    //Here we use HTTP 'post' method.
    //'post' means add value.
    //Route.post() requires a callback function.
    //Agar user '/register' pai ayaa hai tohs usse registerUser pai lee jao.
*/

//For file handling:-
    //midlleware always put just before the method of execution.
    /*
        app.post('/profile', upload.single('avatar'), function (req, res, next) {
        // req.file is the `avatar` file
        // req.body will hold the text fields, if there were any
        })

        app.post('/photos/upload', upload.array('photos', 12), function (req, res, next) {
        // req.files is array of `photos` files
        // req.body will contain the text fields, if there were any
        })
    */
    import { upload } from "../middlewares/multer.middleware.js";

    //For registration:-
        //Upload is the instance of multer.
        // Set up a route for file uploads:-
    router.route("/register").post(
        upload.fields(
            //It takes an array of objects.
            [
                {
                    name:"avatar",
                    maxCount:1 //how many numbers of image you want? 
                },
                {
                    name:"coverImage",
                    maxCount:1 //how many numbers of image you want? 
                }
            ]
        ),
        registerUser);


    import { verifyJWT } from "../middlewares/auth.middleware.js";
    //For login:-
        router.route("/login").post(loginUser)

    //Secured routes:-
        //For logout:-
            router.route("/logout").post(verifyJWT, logoutUser)
            //                           middleware
            //Logout karne se pehle check karo middleware.

        //For refresh accessToken:-
            router.route("/refresh-access-token").post(refreshAccessToken)

        //For change-password:-
            router.route("/change-password").post(verifyJWT, changeCurrentPassword)

        //For getting information about current user:-
            router.route("/current-user").get(verifyJWT, getCurrentUser)

        //For updating account details:-
            router.route("/update-account").patch(verifyJWT, updateAccountDetails)

        //For updating user-avatar:-
            //1st verify "user is present or not?" , then go for file upload.
            router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

        //For updating user-coverImage:-
            //1st verify "user is present or not?" , then go for file upload.
            router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

        //For getting inforamtion about a channel:-
            // " : " => It is important.
            router.route("/c/:userName").get(verifyJWT, getUserChannelProfile)

        //For getting watch history of an user:-
            router.route("/history").get(verifyJWT, getWatchHistory)

            
export {router};