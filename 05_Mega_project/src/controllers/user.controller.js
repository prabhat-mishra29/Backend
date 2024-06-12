import { User } from "../models/user.model.js";
import { APIerror } from "../utils/APIerror.js";
import { APIresponse } from "../utils/APIresponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
                    //$or = is a mongoDB operators
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
            //user is a variable here.
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


//Login user:-

        //Standardize method for creating both access and refresh token:-
        const generateAccessAndRefereshTokens = async(userId) =>{
            //"User" :- mongoose 'User'
            //user :- variable
            try {
                const user = await User.findById(userId);

                const accessToken = user.generateAccessToken();
                const refreshToken = user.generateRefreshToken();

                //We give access token to user and save refresh token in our database.
                user.refreshToken = refreshToken
                //mongoose "refreshToken"

                //Save it.
                await user.save({ validateBeforeSave: false })
                //Validate kuch matt karo direct save kardo.

                return {accessToken, refreshToken}

            } catch (error) {
                throw new APIerror(500, "Something went wrong while generating referesh and access token")
            }
        }
   
        
const loginUser = asyncHandler( async(req,res) => {
        // 1.Get data from user using "req.body".
        // 2.username based checking or email based checking.
        // 3.find the user.
        // 4.check password.
        // 5.If password is incorrect , then show some message.
        // 6.If it is correct then generate both access and refresh tokens and send them to the user in the form of cookies.
        // 7.Send response.

        //2:-
            const {email, userName, password} = req.body
            console.log(email);

            if (!userName && !email) {
                throw new APIerror(400, "username or email is required")
            }
        
            // Here is an alternative of above code based on logic discussed in video:
                // if (!(userName || email)) {
                //     throw new APIError(400, "username or email is required")
                    
                // }

            
        //3:-
            //User :- mongoose 'User'
            //user is a variable here.
            const user = await User.findOne({
                $or: [{userName}, {email}]
                //Check either userName or email present in database or not.
                //$or = is a mongoDB operator
            })

            if (!user) {
                throw new APIerror(404, "User does not exist")
            }

        
        //4:-
            const isPasswordValid = await user.isPasswordCorrect(password)
            //It was a method that was created when we configured the 'user' model.

            if (!isPasswordValid) {
                throw new APIerror(401, "Invalid user credentials")
                }


        //5:-        
            //We will create a standardize method for creating both refresh and acess tokens.(at line number 223)
            const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)
            console.log("refreshToken = ",refreshToken);
            console.log("accessToken = ",accessToken);


        //6:-
            const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

            console.log(loggedInUser)

            //Send both refreshToken and accessToken in the form of cookies.

            //setting some options for cookie:-
            const options = {
                //By default, anyone can modify cookies on the frontend side.
                //When we use these syntaxes, they can only be modified by the server side.
                httpOnly: true,
                secure: true
            }

            //By using "cookie parser," we can access cookies on both 'req' and 'res'.
            return res
                    .status(200)
                    .cookie("accessToken", accessToken, options)
                    //          key             value
                    .cookie("refreshToken", refreshToken, options)
                    //          key             value
                    .json(
                        new APIresponse(
                            200, 
                            {
                                user: loggedInUser,
                                accessToken,
                                refreshToken
                                //We have already set tokens in the form of cookies, so why do we need to send them again?
                                //This edge case is valid when the user wants to store them in their local storage or header files for mobile applications.
                            },
                            "User logged In Successfully"
                        )
                    )
    } 
)


//Logout user:---
    //Agar user logout karr diya toh usse resource access karne ke liye dubara login karna padega.
    //For that we remove cookies and reset refresh tokens.
    //By using "cookie parser," we can access cookies on both 'req' and 'res'.
    const logoutUser = asyncHandler(async(req, res) => {
        //How to find user?
        //In login, we use email and password for verifying the user.
        //Do we need email and password for finding the user in logout? -> No
        //We will crate a custom middleware to solve this problem.[Go to auth.middleware]

        // After creating the auth.middleware.js and adding it as a middleware in the routes, we were able to access the "req.user" object.
        await User.findByIdAndUpdate(
            //Parameter:- id , update , options .
            req.user._id,
            {
                //mongoDB operator
                //The $unset operator deletes a particular field.
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                //We will receive a new response in return.
                new: true
            }
        )

        //cookie's options
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new APIresponse(200, {}, "User logged Out"))
            //                      data=empty 

        // Here we can create a "req.user" object without using middleware. However, creating a separate middleware for this is not the only scenario where we check if the user is present. This can be implemented for various purposes such as adding a post, liking a post, etc.
    }
)


// We will create an endpoint,where user can refresh it's expiry.
    const refreshAccessToken = asyncHandler(async (req, res) => {
        //How to access refresh token?
        //If someone hit an endpoint , then we will collect refresh token from their cookies.
            const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
            //                                                       for mobile application
            console.log("incomingRefreshToken = ",incomingRefreshToken);

        if (!incomingRefreshToken) {
            throw new APIerror(401,"unauthorized request")
        }

        try {
            //Retrive user information from incoming refresh token.
                //Decode incoming refresh token.
                //find user.
                const decodedToken = jwt.verify(
                    incomingRefreshToken,
                    process.env.REFRESH_TOKEN_SECRET
                )
            
                const user = await User.findById(decodedToken?._id)
            
                if (!user) {
                    throw new APIerror(401, "Invalid refresh token")
                }
        
            //compare incoming refersh token with database refresh token.
                //If not:-
                if (incomingRefreshToken !== user?.refreshToken) {
                    throw new APIerror(401, "Refresh token is expired or used")
                    
                }
        
                //If yes:-
                //cookie option:-
                    const options = {
                        httpOnly: true,
                        secure: true
                    }
            
                //Generate new access token:-
                    const {AccessToken, RefreshToken} = await generateAccessAndRefereshTokens(user._id)
            
                    console.log("AccessToken = ",AccessToken);
                    console.log("RefreshToken = ",RefreshToken);

                return res
                    .status(200)
                    .cookie("accessToken", AccessToken, options)
                    .cookie("refreshToken", RefreshToken, options)
                    .json(
                        new APIresponse(
                            200, 
                            {
                                accessToken:AccessToken,
                                refreshToken:RefreshToken
                            },
                            "Access token refreshed"
                        )
                    )
        }
        catch (error) {
            throw new APIerror(401, error?.message || "Invalid refresh token")
        }
    }
)


// Change current password:-[We perform "CRUD" operations here.]
    const changeCurrentPassword = asyncHandler(async(req, res) => {
        //Take oldPassword and newPassword from user[request].
            const {oldPassword, newPassword} = req.body;

        //If the user is logIn , using "verifyJWT" we will get information about the user.
            const user = await User.findById(req.user?._id);

        //Please verify whether the 'oldPassword' matches the password saved in the database.
            const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

            if (!isPasswordCorrect) {
                throw new APIerror(400, "Invalid old password")
            }

            console.log("oldPassword = ",oldPassword);
            console.log("new Password = ",newPassword);

        //changethe  password and save.
            user.password = newPassword;
            await user.save({validateBeforeSave: false});

            return res
                .status(200)
                .json(new APIresponse(200, {}, "Password changed successfully"))
            })


// Get current user:-
    // We have a middleware called "verifyJWT" which gives us information about the user(req.user).
    const getCurrentUser = asyncHandler(async(req, res) => {
        return res
            .status(200)
            .json(new APIresponse(
                200,
                req.user,
                "User fetched successfully"
            ))
    })


// update user account details:-
    const updateAccountDetails = asyncHandler(async(req, res) => {
        const {fullName, email} = req.body;

        if (!fullName || !email) {
            throw new APIerror(400, "All fields are required")
        }

        //We have a middleware called "verifyJWT" which gives us information about the user(req.user).
        //Parameter:- id , update , options .
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                //operator:-
                //The $set operator replaces the value of a field with the specified value.
                $set: {
                    fullName,
                    email:email
                }
            },
            {
                //updated new response return hoga.
                new: true
            }
            
        ).select("-password")

        return res
            .status(200)
            .json(new APIresponse(200, user, "Account details updated successfully"))
    });


//Time for updating files:-
    // Here we use two middlewares multer and verifyJWt[wohi logg update karenge joo login hoo.]

    const updateUserAvatar = asyncHandler(async(req, res) => {
        //using multer middleware, we get req.file .
        //Here we need to update one file so we use "req.file". But in 'register', we upload two fields so we use "req.files". 
        const avatarLocalPath = req.file?.path;
    
        if (!avatarLocalPath) {
            throw new APIerror(400, "Avatar file is missing")
        }
    

        //TODO: delete old image - assignment
        //Retrive 'url' from the user using "req.user".
            const help=await User.findById(
                req.user?._id
            ).select("-password -refreshToken");
            
            const oldPath=help.avatar;
            console.log("old path = ",oldPath);

            const check=await deleteOnCloudinary(oldPath);

            if(!check){
                throw new APIerror(400,"Some problem on delete avatar in the Cloudinary!") 
            }
    

        const avatar = await uploadOnCloudinary(avatarLocalPath); //return avatar object
    
        if (!avatar.url) {
            throw new APIerror(400, "Error while uploading on avatar") 
        }
    
        //We have a middleware called "verifyJWT" which gives us information about the user(req.user).
        //Parameter:- id , update , options .
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    avatar:avatar.url //We need avatar.url .
                }
            },
            {new: true}
        ).select("-password")
    
        return res
            .status(200)
            .json(
                new APIresponse(200, user, "Avatar image updated successfully")
            )
    })

    const updateUserCoverImage = asyncHandler(async(req, res) => {
        //using multer middleware, we get req.file .
        //Here we need to update one file so we use "req.file". But in 'register', we upload two fields so we use "req.files". 
        const coverImageLocalPath = req.file?.path;
    
        if (!coverImageLocalPath) {
            throw new APIerror(400, "Cover image file is missing")
        }
    
        //TODO: delete old image - assignment
        //Retrive 'url' from the user using "req.user".
            const help=await User.findById(
                req.user?._id
            ).select("-password -refreshToken");
            
            const oldPath=help.coverImage;
            console.log("old path = ",oldPath);

            const check=await deleteOnCloudinary(oldPath);

            if(!check){
                throw new APIerror(400,"Some problem on deleting coverImage in the Cloudinary!") 
            }

        const coverImage = await uploadOnCloudinary(coverImageLocalPath) //return coverImage object
    
        if (!coverImage.url) {
            throw new APIerror(400, "Error while uploading on avatar")
        }
    
        //We have a middleware called "verifyJWT" which gives us information about the user(req.user).
        //Parameter:- id , update , options .
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    coverImage: coverImage.url // we need coverImage.url .
                }
            },
            {new: true}
        ).select("-password")
    
        return res
            .status(200)
            .json(
                new APIresponse(200, user, "Cover image updated successfully")
            )
    })


// Learn the "monogoDB aggregation pipeline" before going further.
// MongoDB aggregation pipelines for connecting subscription and user models.

    const getUserChannelProfile = asyncHandler(async(req, res) => {
        // When you need a channel's profile, you go to its URL.
        //  example:- /chai-aur-code or /take-you-forward
        //So we use 'req.params'.

        const {userName} = req.params;

        if (!userName) {
            throw new APIerror(400, "userName is missing")
        }

        userName.trim();

        /*
            Brute force approach:-
                user=User.find(userName)
                //1st, we will retrieve the 'user' from the database and then 'aggregate' it based on their 'id'.
        */

        //Direct method using aggregation:-
        const channel = await User.aggregate([
            {
                //Usually,we take 'match' as our first pipeline.
                // Filters the documents to pass only the documents that match the specified condition(s) to the next pipeline stage.
                //  syntax :- { $match: { <query> } }

                //'User' collection main jitne v 'userName' hain , jiska 'userName' ke sath match hua woo return karo.
                // example:- 'chai-aur-code' user
                $match: {
                    userName: userName?.toLowerCase()
                }
                //We have one userName here, so it will display information about that user.
            },
            {
                $lookup: {
                    from: "subscriptions", //kahan se lana hai.
                    localField: "_id", // konse current document ke field se connect karna hai.
                    foreignField: "channel", // konsa foreign field akee connect hoga. 
                    as: "subscribers" // konse name se represent hoga.
                    //main jiska channnel rahunga , unhone mujhe subscribe kiya hai.
                    //jiska channel='chai-aur-code' hoga, wohh mera subscriber hoga.
                }
            },
            {
                $lookup: {
                    from: "subscriptions",
                    localField: "_id",
                    foreignField: "subscriber",
                    as: "subscribedTo"
                    //maine jiss jisko subscribe kiye hai,unka subscriber main rahunga.
                    //jiska subscriber='chai-aur-code' hoga, unko maine subscribe kiya hai.
                }
            },
            {
                // Adds new fields to documents. $addFields outputs documents that contain all existing fields from the input documents and newly added fields.
                // { $addFields: { <newField>: <expression>, ... } }
                //We will add three new fileds in 'chai-aur-code' user.
                $addFields: {
                    subscribersCount: {
                        $size: "$subscribers"
                        // "subscribers" is also now become a field , so we use '$'.
                    },
                    channelsSubscribedToCount: {
                        $size: "$subscribedTo"
                        // "subscriberedTo" is also now become a field , so we use '$'.
                    },

                    //We will send a message either true or false so that the frontend will deal with it according to it.
                    isSubscribed: {
                        $cond: {
                            //The $in operator selects the documents where the value of a field equals any value in the specified array.
                            // { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
                            // apke pass joo document ayaa hai "subscribers" usme mainhnuu yaa nai?
                            /*
                                > Suppose prabhat ne check kiya 'chai-aur-code' user ke profile ko.
                                > req.params :- chai-aur-code
                                > req.user[verify JWT] :- prabhat
                                > Check 'prabhat' , 'chai-aur-code' user ke subscribers main present hai hai nai.
                            */
                            if: { $in: [ req.user?._id, "$subscribers.subscriber"] },
                            // "subscribers" = array objects.
                            // object consist of 'subscriber','channel'.
                            // Here channel is already fixed. i.e. 'chai-aur-code'.
                            // Only 'subscriber' holds different users.
                            then: true,
                            else: false
                        }
                    }
                }
            },
            {
                // Passes along the documents with the requested fields to the next stage in the pipeline. The specified fields can be existing fields from the input documents or newly computed fields.
                // Selected things will be return to the viewer.
                // Here 'prabhat'.
                $project: {
                    fullName: 1,
                    userName: 1,
                    subscribersCount: 1,
                    channelsSubscribedToCount: 1,
                    isSubscribed: 1,
                    avatar: 1,
                    coverImage: 1,
                    email: 1
                }
            }
        ])

        if (!channel?.length) {
            throw new APIerror(404, "channel does not exists")
        }

        console.log("channel = ",channel);
        //returns a document that contains an array of modified objects.
        /*
            channel =  [
                            {
                                _id: new ObjectId('6658cd7ba48e434ed28816d6'),
                                userName: 'prabhat_29',
                                email: 'prabhatmishra398@gmail.com',
                                fullName: 'Prabhat Mishra',
                                avatar: 'http://res.cloudinary.com/prabhat29/image/upload/v1717450654/mlrkxvzloj4vl1l1wpvh.jpg',
                                coverImage: 'http://res.cloudinary.com/prabhat29/image/upload/v1717451068/kelay1zb0srng5b0zfb2.jpg',
                                subscribersCount: 0,
                                channelsSubscribedToCount: 0,
                                isSubscribed: false
                            }
                        ]
        */

        //Here we will return one object.
        return res
            .status(200)
            .json(
                new APIresponse(200, channel[0], "User channel fetched successfully")
                /*
                    channel [0] = {
                        _id: new ObjectId('6658cd7ba48e434ed28816d6'),
                        userName: 'prabhat_29',
                        email: 'prabhatmishra398@gmail.com',
                        fullName: 'Prabhat Mishra',
                        avatar: 'http://res.cloudinary.com/prabhat29/image/upload/v1717450654/mlrkxvzloj4vl1l1wpvh.jpg',
                        coverImage: 'http://res.cloudinary.com/prabhat29/image/upload/v1717451068/kelay1zb0srng5b0zfb2.jpg',
                        subscribersCount: 0,
                        channelsSubscribedToCount: 0,
                        isSubscribed: false
                    }
                */
            )
    })


// Nested lookup for "watch_history":- 
    //Why do we use ObjectId[] for storing ids of 'videos model'?
    //  less in number , we can use array here.

    /*
        > What do you get from 'req.user._id'? 
            example:-
            - a string , "6658cd7ba48e434ed28816d6"
            - monogoose convert this string to mongoDB ID.
            - ObjectId('6658cd7ba48e434ed28816d6')
    */

   // req.user = coming from cookies [verifyJWT]

    const getWatchHistory = asyncHandler(async(req, res) => {
        const user = await User.aggregate([
            {
                $match: {
                    // _id:req.user._id; [ Not possible here ] Why?
                    // mongoose is not used here.So it can not convert from string to ObjectId.
                    //So we create mongoose ObjectId on our own.
                    _id: new mongoose.Types.ObjectId(req.user._id)
                }
            },
            {
                //We are in 'user' model now.
                $lookup: {
                    // Get video_id from video model.
                    from: "videos",
                    localField: "watchHistory",
                    foreignField: "_id", //video-id
                    as: "watchHistory",

                    //After performing above 'lookup' opeartion we get an array[watchHistory] of containing "video_id"s only.Without having information about the user.

                    //To get the owner's information, we create a sub-pipeline.

                    pipeline: [
                        {
                            // Get owner information from user model.
                            $lookup: {
                                from: "users",
                                localField: "owner", //video-model
                                foreignField: "_id",
                                as: "owner",

                                // User ka sara information agaya hai.lekin hamme selected return karna hai.
                                // TODO :- Agar hmm second stage pai 'project' operator use karte toh kya hota? [Do and see what happens.]
                                // Structure of data will be changed.

                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            userName: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }

                        },

                        // We add a second pipeline for a better understanding of the frontend part.
                        // owner field gives you an array of objects.
                        // arr[0] will return an object contains owner's fullName,userName,avatar.
                        
                        // For better usage, we add a new field that will return 1st object of an object.
                        {
                            $addFields:{
                                owner:{
                                    $first: "$owner"
                                }
                            }
                        }
                    ]

                }
            }
        ])
    
        console.log("user = ",user);
        // user returns an array.
        /*
            user = [
                {
                    _id: new ObjectId('6658cd7ba48e434ed28816d6'),
                    userName: 'prabhat_29',
                    email: 'prabhatmishra398@gmail.com',
                    fullName: 'Prabhat Mishra',
                    avatar: 'http://res.cloudinary.com/prabhat29/image/upload/v1717450654/mlrkxvzloj4vl1l1wpvh.jpg',
                    coverImage: 'http://res.cloudinary.com/prabhat29/image/upload/v1717451068/kelay1zb0srng5b0zfb2.jpg',
                    password: '$2b$10$KNhVMueYdHN8diAyk5bik.4aJuIUcoNjKl/DX.60FBBK4vD1N1J0i',
                    watchHistory: [],
                    createdAt: 2024-05-30T19:03:23.427Z,
                    updatedAt: 2024-06-03T21:44:32.388Z,
                    __v: 0,
                    refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjU4Y2Q3YmE0OGU0MzRlZDI4ODE2ZDYiLCJpYXQiOjE3MTc0NTAzNTYsImV4cCI6MTcxODMxNDM1Nn0.DnEnmZpG6n2ATwHGEFylpzcjfIdAoiXxIsPSwn9EVOY'    
                }
            ]
        */

        return res
            .status(200)
            .json(
                new APIresponse(
                    200,
                    user[0].watchHistory, //1st value from aggregation pieline.
                    /*
                        user[0] = {
                            _id: new ObjectId('6658cd7ba48e434ed28816d6'),
                            userName: 'prabhat_29',
                            email: 'prabhatmishra398@gmail.com',
                            fullName: 'Prabhat Mishra',
                            avatar: 'http://res.cloudinary.com/prabhat29/image/upload/v1717450654/mlrkxvzloj4vl1l1wpvh.jpg',
                            coverImage: 'http://res.cloudinary.com/prabhat29/image/upload/v1717451068/kelay1zb0srng5b0zfb2.jpg',
                            password: '$2b$10$KNhVMueYdHN8diAyk5bik.4aJuIUcoNjKl/DX.60FBBK4vD1N1J0i',
                            watchHistory: [],
                            createdAt: 2024-05-30T19:03:23.427Z,
                            updatedAt: 2024-06-03T21:44:32.388Z,
                            __v: 0,
                            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjU4Y2Q3YmE0OGU0MzRlZDI4ODE2ZDYiLCJpYXQiOjE3MTc0NTAzNTYsImV4cCI6MTcxODMxNDM1Nn0.DnEnmZpG6n2ATwHGEFylpzcjfIdAoiXxIsPSwn9EVOY'    
                        }
                    */
                    "Watch history fetched successfully"
                )
            )
    })


export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory}