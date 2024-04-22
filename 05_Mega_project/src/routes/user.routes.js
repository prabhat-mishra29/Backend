import {Router} from "express"
import { registerUser } from "../controllers/user.controller.js";


const router=Router();


router.route("/register").post(registerUser);
//Here we use HTTP 'post' method.
//Route.post() requires a callback function.
//Agar user '/register' pai ayaa hai tohs usse registerUser pai lee jao.


export {router};