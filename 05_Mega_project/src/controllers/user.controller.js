import { User } from "../models/user.model.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Controller:-is a part of the software that handles user inputs and makes decisions about what data should be presented to the user and how it should be presented.
// So we create a register method which gets data from user and sends required data to user.

/*
    //Basic guide for creating a register method :-
    const registerUser = asyncHandler( async(req,res)=>{
        //usually we send a status and a json of response.
        //json is for frontend purpose.
        //you can use return or you can not use return here.
        return res.status(200).json(
            {
                message:"chai aur code"
            }
        )
    } )
*/

const registerUser = asyncHandler( async(req,res)=>{
        //1. Get user details from frontend:-
            //Here frontend means we get data from postman.
            //user ka details kya lena yee depend karega ki user model kaisa bana hai.
            //username,email,fullname,avatar,coverImage,password.
            //watchHistory and refreshtoken will add programaticaly we donot need from 'postman'.

        //2. All type of validation: here we will consider for empty String only.
            //username kahi empty toh nahi,yaa phir email or fullname.

        //3. Check if user already exists or not?
            //using either email or username

        //4. Check for images and check for avatar.
            //if present upload them to cloudinary.
            //check multer ne save kiya ki nahi uske badd check cloudinary pai upload hua ki nahi.
            //check for avatar specifically.

        //5. Create user-object.
            // beacuse in mongoDB(no sql) we preffer objects.
            // create entry in DB. (.create())

        //6. check response is present or not.
            //If present:-
                //In monogDB,response joo milega jitna v create hua hai woh as it mill jayega , so we remove password and refresh token from response.Taki user ko return mai password and refreshToken na jaye.
            //If response comes that means successfully we craete a user and return it.
            //If not present return null.


        //1.
            // Data coming from form or json ,then we use "req.body".
            // from URL :- we deal this later.
                // de-structure it:-
                const{fullName , email , userName , password}=req.body;

                /*
                    //How to post data in body in 'postman'?
                    >Go to postman, then go to body.
                        -you have multiple options to post data.
                        -we choose here raw with json.
                        - and give data {
                            "email" : "hello@gmail.com",
                            "password" : "123"
                        }

                    //After posting data in body,we will get our email and password in console. :-> hello@gmail.com and 123 .
                */
                
                console.log("email : ",email);
                console.log("password : ",password);


        //2.Validation:-
            /*
                if(fullName === ""){
                    //class for "Error handling".
                    throw new APIerror(400,"full name is required");
                }
                if(email === ""){
                    //class for "Error handling".
                    throw new APIerror(400,"eamil is required");
                }
                if(userName === ""){
                    //class for "Error handling".
                    throw new APIerror(400,"user name is required");
                }
                if(password=== ""){
                    //class for "Error handling".
                    throw new APIerror(400,"password is required");
                }
            */
            
                //Advance syntax:-
                    if (
                        [fullName, email, userName, password].some((field) => field?.trim() === "")
                    ) {
                        throw new APIerror(400, "All fields are required")
                    }
            

        //3.
            //How to know user is already exists or not?
            //By the help of 'user.model'.Using mongoose "User" can talk with mongoDB whenever he/she wants.
            /*
                User.findOne( {userName} ) //on the basis of userName
                User.findOne( {email} ) //on the basis of email
            */
            
            //advance syntax:-
                const existedUser = await User.findOne({
                    $or: [{userName}, {email}]
                    //Check userName or email present or not
                })
            
                if (existedUser) {
                    throw new APIerror(409, "User with email or user name already exist.")
                }


        //4.
            //We do not perform any action for file handeling right now.
            //If we use 'req.files' then it will not give anything to us.
            //Now it is time for file hanling.We use multer middleware.
            //multer will give access some extra methods like req.files().
            //go to 'user.router' for file handling and how to use middlewares.
                //nested check:-
                    const avatarLocalPath=req.files?.avatar[0]?.path ;
                    //req.files? :- If req.files exist karata hai
                    //avatar[0]? :- avatar is a image and it has many properties like png,jpeg.But we need 1st object.From 1st object we can get path.
                    //path :-multer ne joo file upload kiya hai uska path.

                //nested check:-
                    const coverImageLocalPath=req.files?.coverImage[0]?.path ;
                    //req.files? :- If req.files exist karata hai
                    //avatar[0]? :- coverImage is a image and it has many properties like png,jpeg.But we need 1st object.From 1st object we can get path.
                    //path :-multer ne joo file upload kiya hai uska path.

                /*
                    //classical way to check coverImageLocalPath present or not:-
                        let coverImageLocalPath;
                        
                        if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
                            coverImageLocalPath = req.files.coverImage[0].path
                        }
                */

                //we must check avatar path is present or not.
                if(!avatarLocalPath){
                    throw new APIerror(400, "Avatar file id required!")
                }


                //upload on cloudinary.It need a localPath of image.
                //It takes time to upload.
                const avatar_cloudinary=await uploadOnCloudinary(avatarLocalPath);
                const coverImage_cloudinary=await uploadOnCloudinary(coverImageLocalPath);

                console.log("avatarLocalPath = ",avatarLocalPath);
                console.log("avatar_cloudinary = ",avatar_cloudinary);
                
                //agar upload nahi hua hai toh error show karo.
                if(!avatar_cloudinary){
                    throw new APIerror(400, "Avatar file id required!")
                }


        //5.
            //data base entry.
            //Here "User" is mongoose User.
            //Database ke sath batt karne pai lagega time.Database lies on different continent.
            const user=await User.create(
                //takes object
                {
                    fullName:fullName,

                    avatar:avatar_cloudinary.url, //we need only url
                    //we did not check for coverImage that it is presnt or not.It's loacl path is present or not.It is successfully upload or not.

                    coverImage:coverImage_cloudinary?.url || "" ,
                    //Agar coverImage_cloudinary present hai toh url doo nahi toh "" doo.

                    email:email,

                    userName:userName.toLowerCase(),

                    password:password
                }
            )

        //Extra thing:-
            console.log("req.body = ",req.body);
            console.log("req.files = ",req.files);
           
        //6.
            //User create hua hai yaa nahi.
            //mongoDB creates a '_id' for every entry.
            //remove password and refresh token field.
            const createdUser=await User.findById(user._id).select(
                //kya kya nahi lena hai.
                "-password -refreshToken"
            )
            
            if(!createdUser){
                throw new APIerror(500,"Something went wrong while registering the user.")
            }

            //handel response:-
            return res.status(201).json(
                new APIresponse(200,createdUser,"User registered successfully")
            )
    } 
)

export {registerUser}