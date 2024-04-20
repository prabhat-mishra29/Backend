class APIerror extends Error{
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){
        //Stack :- Error stack 
        //  >An error stack is a collection of error handling methods that record the type of error, when it occurs, and the reasons for it.
        
        //Override:-
            super(message)
            this.statusCode=statusCode
            this.message=message

        //Add extra filed in constructor:-
            this.data=null; //Assignment :- learn what are the things available in the 'this.data' field?
            this.success=false; //Here we handle API errors not response,so by-default we use success as fault.
            this.errors=errors;

        if(stack){
            this.stack=stack;
        }
        else{
            Error.captureStackTrace(this,this.constructor)
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