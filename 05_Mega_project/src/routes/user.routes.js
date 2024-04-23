import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js";


const router=Router();

/*
    router.route("/register").post(registerUser);
    //Here we use HTTP 'post' method.
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
    router.route("/register").post(
        upload.fields(
            [
                {
                    name:"avatar",
                    maxCount:1
                },
                {
                    name:"coverImage",
                    maxCount:1
                }
            ]
        ),
        registerUser);

export {router};