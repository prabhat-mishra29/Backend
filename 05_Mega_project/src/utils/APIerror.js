class APIerror extends Error{
    constructor(statusCode,message="Something went wrong",errors=[],stack=""){ //Stack :- Error stack
        //Override
        super(message)
        this.statusCode=statusCode
        this.data=null; //Assignment :- learn what are the things available in the 'this.data' field?
        this.message=message
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

export {APIerror}