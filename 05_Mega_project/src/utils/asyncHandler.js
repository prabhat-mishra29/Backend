//using try-catch:- 
    /*
    'asyncHandler' is a higher order function.
        > A higher order function is a function that takes one or more functions as arguments, or returns a function as its result.

        function callbackFunction(){
            console.log('I am  a callback function');
        }

        // higher order function:-
        function higherOrderFunction(func){
            console.log('I am higher order function')
            func()
        }

        higherOrderFunction(callbackFunction);
    */
    /*
        const asyncHandler = (func) => {
            ()=>{

            }
        }

        OR

        const asyncHandler = (func) => () =>{ }
        

        //How to add async:-
            const asyncHandler = (func) => {
                async()=>{

                }
            }

            OR 
            
            const asyncHandler = (func) => async() =>{ }
    */
    /*
    const asyncHandler = (func) => async(req,res,next) => {
            //Extract req, res, and next from a function that is passed as a parameter.
            try {
                //pass function:-
                await func(req,res,next)
            } catch (error) {
                //usually we send a status and a json of response.
                //json is for frontend purpose.
                res.status(error.code||500).json( {
                    success:false,
                    message:error.message
                } )
            }
        }

    */

//using promises:-
    const asyncHandler = (func)=>{
        //Here we will return this in the form of promises.
        return (req,res,next)=>{
            Promise.resolve( 
                //Pass function:-
                func(req,res,next) 
            ).reject(
                (err)=>next(err) 
            //jisko v agge kamm karna hai toh woh karr paye.
            )
        }
    }

    export default asyncHandler;