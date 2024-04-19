//As early as possible in your application, import and configure dotenv.

// require('dotenv').config( {path:'./.env'} ) //You can give path also.

//For improve version:-
import dotenv from 'dotenv'
dotenv.config({
    path:'./.env'
})
//We use an experimental feature:- [go to package.json]


// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js"
// import express from 'express'
import connectDB from "./DB/db.js";
import app from './app.js';

//How to connect database:-
/*
    //1st approach:-

        //Syntax:-
            //     const mongoose = require('mongoose');
            //     mongoose.connect('mongodb://127.0.0.1:27017/test');

            // //But this is not the better way to do our connection.

        //Better way:-
            // //1st:-
            //     function connectDB(){

            //     }

            //     connectDB();

            //2nd:-[using IIFE]
            //Database needs async and await for response and try-catch for connecting.

            //Sometimes you see that,user creates 'app' from express in index.js file and use it according to it.
                const app=express();

                ;( async()=>{
                    try {
                        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
                        // "mongodb+srv://prabhat_mishra:Prabhat123@cluster0.j7phqdv.mongodb.net"/"videotube"

                        //database connect hogaya hai,kya pata hamra express ka app woh baat nahi karr para hai. 
                        app.on("error",()=>{
                            console.error("ERROR [NOT able to talk] : ",error);
                            throw error
                        })

                        app.listen(process.env.PORT,()=>{
                            console.log(`APP is listening on port : ${process.env.PORT}.`);
                        })
                    } catch (error) {
                        console.error("ERROR : ",error)
                        throw error
                    }
                } )()
*/

    //2nd approach:-
        //Go to db.js ,create connection code there and then import in here(index.js).
        connectDB() //Returns a promise
            .then(()=>{
                //when server loads:-
                
                app.on("error",()=>{
                    console.error("ERROR [NOT able to talk] : ",error);
                })

                app.listen(process.env.PORT||8000,()=>{
                    console.log(`APP is listening on port : ${process.env.PORT||8000}.`);
                })
                
            })
            .catch((err)=>{
                console.log("Mongo db connection failed !!!",err)
            })