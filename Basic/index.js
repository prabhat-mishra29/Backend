// console.log("backend"); 
// How to run 'index.js' using node :- node index.js in terminal
// HOw to run 'index.js' using package.json :- npm run start ["start": "node index.js"]

require('dotenv').config()
//import 'dotenv/config'

const express = require('express')
//Another way:- import { express } from 'express'

//Variable:-
const app = express()
//Like when we import MATH , we can access different methods of it like 'MATH.pow ,MATH.abs etc etc'.
//Similarlly for 'app' 


/*
    //Variable:- [take as your wish]
    const port = 4000
*/
    const port=process.env.PORT;


//'get' request:-
    /*
        syntax:- app.get('',(req,res)=>{})
                        route    callback
    */
    //'app' appp jake '/' or home-route pai jake listen karo.
    //Agar kuch 'req' ayaa toh 'res' ko use karke ekk response vejo.
    //Response kuch v ho sakta hai. string,array,object,message,cookie,html element,json etc.

    app.get('/', (req, res) => {
    res.send('Hello World!')
    })

    //Learn about 'req' and 'res' keywords in express doc.

    app.get('/twitter',(req,res)=>{
        res.send('Prabhat Mishra')
    })

    app.get('/login',(req,res)=>{
        res.send('<h1>Please log in at chai aur code.</h1>')
    })
    /*
        > It shows "Cannot GET /login"
        > It is because of 'hot-reloading'.
        > Hot Reloading is a feature in React Native that allows developers to instantly see the result of the latest change.
        > Solution:- stop server and run it again.
    */

    app.get('/youtube',(req,res)=>{
        res.send('<h2>Chai aur code</h2>')
    })


//Now it is time for listen:-
/*
    syntax:- app.listen(port,()=>{})
                            callback
*/
    /*
        app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
        })
    */
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })



//after running this file in terminal you will see that:-your app is not terminated but it is constantly listenning.
//Here it is your server.
//when someone sends request it responses according to it.
// Note:-localhost:4000 -> It valids and free only in my device.


//> After creating your own server now we move to deployment part. 
/*
    Problem:- Port number '4000' is free in our device so we gives us some result.It is not sure that it will be free for another device/user.Some times they give their own port to server forcefully.
            > In production grade application, we define some special variable like databaseId,URL_id etc and it will kept hide from others.
*/

//Install 'dotenv' package and learn about it.Make another file '.env' and paste port number into it.
//Dotenv is a zero-dependency module that loads environment variables from a .env file into process.env.
//How to access .env :- import 1st then use "process.env.+file name"