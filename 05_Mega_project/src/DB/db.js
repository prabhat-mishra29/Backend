import mongoose from "mongoose";
import {DB_NAME} from "../constants.js"

const connectDB= async()=>{
        try {
            //We can store this in a variable,because mongoose gives us an object as return.
            const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
            // "mongodb+srv://prabhat_mishra:Prabhat123@cluster0.j7phqdv.mongodb.net"/"videotube"

            console.log(`\n MONGODB connected !! DB host : ${connectionInstance.connection.host}`); //assignment:- check the result
            //databse is different for testing,production,devlopment.
            //For a better understanding of your host, we did this.

        } catch (error) {
            console.error("MONGODB connection FAILED : ",error)
            //Insted of using 'throw error' we use a different approach:-
            //NodeJs provides access of 'process'.process is nothing but a reference of current application that runs in a process.
            //Learn this in NodeJs documentry.
            process.exit(1)
            /*
                > The process.exit() method instructs Node.js to terminate the process synchronously with an exit status of code. 
                > If code is omitted, exit uses either the 'success' code 0 or the value of process.exitCode if it has been set. 
                > Node.js will not terminate until all the 'exit' event listeners are called.
            */

        }
    }

export default connectDB;