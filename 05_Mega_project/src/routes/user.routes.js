import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js";


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

export {router};