class APIerror extends Error{
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
        //Stack :- Error stack 
        //  >An error stack is a collection of error handling methods that record the type of error, when it occurs, and the reasons for it.
        
        //Override:-
            super(message)
            this.statusCode=statusCode
            this.message=message
            this.errors=errors;

        //Add extra filed in constructor:-
            this.data=null; //Assignment :- learn what are the things available in the 'this.data' field?
            this.success=false; //Here we handle API errors not response,so by-default we use success as fault.

        if(stack){
            this.stack=stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor)
            /*
                > When an error occurs in JavaScript, the runtime generates a stack trace, which is a list of function calls leading up to the point where the error occurred.
                > This stack trace is helpful for debugging as it shows the sequence of function calls that led to the error.
                > 'this' :- refers to the object that will have its stack trace captured.
                > 'this.constructor' :- refers to the constructor function of the object, which is usually the function that created the object.
            */
        }
    }
}

/*
    HTTP response status codes indicate whether a specific HTTP request has been successfully completed. Responses are grouped in five classes:

        Informational responses (100 – 199)
        Successful responses (200 – 299)
        Redirection messages (300 – 399)
        Client error responses (400 – 499)
        Server error responses (500 – 599)
*/

export {APIerror}