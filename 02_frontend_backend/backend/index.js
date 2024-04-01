// const express = require('express') //Common js :- when you want to get code in synchronised manner.

//Another way:- 
import express from 'express' 
//Module js :- The code is not synchronised. So it gives error while import statement outside a module.
//Solution:-Go to package.json make type:module .

//Variable:-
const app = express();

const port=process.env.PORT || 3000;
//Either env is present or given by default


//express has two main work :- serve and listen
/*
    //Get a list of five jokes:-
    app.get('/jokes', (req, res) => {
        //We do not use url like '/jokes' , we follow some standard practices.

        const jokess=[
            {
                id:1,
                title:'A joke',
                content:'This is a joke'
            },
            {
                id:2,
                title:'B joke',
                content:'This is 2nd joke'
            },
            {
                id:3,
                title:'C joke',
                content:'This is 3rd joke'
            },
            {
                id:4,
                title:'D joke',
                content:'This is 4th joke'
            },
            {
                id:5,
                title:'E joke',
                content:'This is 5th joke'
            },
        ];

        res.send(jokess)
        // Use json-formatter for good look of json response.
    })
*/

//Standardized form:-
    //Get a list of five jokes:-
    app.get('/api/jokes', (req, res) => {
        //We do not use url like '/jokes' , we follow some standard practices.[go to app.jsx]

        const jokess=[
            {
                id:1,
                title:'A joke',
                content:'This is a joke'
            },
            {
                id:2,
                title:'B joke',
                content:'This is 2nd joke'
            },
            {
                id:3,
                title:'C joke',
                content:'This is 3rd joke'
            },
            {
                id:4,
                title:'D joke',
                content:'This is 4th joke'
            },
            {
                id:5,
                title:'E joke',
                content:'This is 5th joke'
            },
        ];

        res.send(jokess)
        // Use json-formatter for good look of json response.
    })

    //'/api':'http://localhost:3000'

app.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`)
});



/*
    //whitelist:-
        -Durse ko ghar main enter nahi karne dena.
        >install package 'cors' and then allow 'cors'.
            install:-
                npm install cors

            usage:-
                var cors = require('cors')
                var app = express()
                app.use(cors())

            you can give any variables like 'origion-options' , 'whitelist-options' etc.
            origion-options:-yee yee option hone chahiye origin ke..
            whitelist-options:-Agar essa kuch origin ayee toh whitelist karr dena.

        >read everything in 'cors npm'.

        #Note:- remember, whitelisting production main kiss hisab se ho raha aur local host pai kiss hisab se ho raha hai.
            - Jabb hmm production main apna 'app' dalenge jaruri nahi ki woh PORT=3000 pai chale , woh kissi aur port pai v chal sakta hai.[learn from video-02 while deploying in digital ocean{process.env}]
            
        >When we build appwrite project at that time we also whitelist our url so that our app runs.
        >We deploy localhost in appwrite cloud.
*/