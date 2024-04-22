import express from 'express'

import cors from "cors"
import cookieParser from "cookie-parser"

const app=express();

//Syntax for use of CORS with some additional settings:-
app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
))

//We have to set some rules because data comes from different resources,like coming from URL,Json,Body-form.
//from json:-
    //for json we set a limit.
    //For configuration:-
        app.use(express.json({limit:"16kb"}))
        //At 1st express can not take json directly , it uses 'body-parser'.learn about it[req.body].But we donot need rightnow.
        //For file uploading express uses 'multer'.

//from URL:-
    //Go to google and search "hitesh choudhary",you will see that it trasfers to "hitesh+choudhary" or "hitesh%20choudhary".
    //We have to encode URL into special characters.
    //for " " URLencode => "%20"
    //For configuration:-
        app.use(express.urlencoded( {extended:true , limit:"16kb"} ))
        //extended :- We have the ability to create objects that are nested within other objects.

//sometimes we need to store some pdf,images in our server ,for that we build a public folder,so that every one can access.
    //For configuration:-
        app.use(express.static("public"))


//Why we need cookie-parser?
    //We can access and set cookies from the user's browser with the help of the server.So that we can perform some 'crud-operations'.
    //Create, read, update, and delete (CRUD)
    //There are some ways you can set secure cookies to the user's browser.These secure cookies can only read and access by server.
    //For configuration:-
        app.use(cookieParser())


//router import:-
    import {router as userRouter} from './routes/user.routes.js';
    
    //Routes declaration:-
    /*
        > We can not use directly 'routers' by the help of app.get() in different file. Why?
        > because it is only valid where the app file is define.
        > To use in a separate file, we utilize middlewares.
        > for that we use app.use().
    */

    //good practice:-use of api and it's version.
    app.use("/api/v1/users",userRouter);
    //When you navigate to the '/users' route, the control is transferred from the main 'app.js' file to the 'userRouter' module.
    // http://localhost:8000/api/v1/users/register

export default app;