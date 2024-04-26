//1st import mongoose
//mongoose helps us to create schema.
//3rd Export schema.


/*
    MongoDB generates a unique user ID automatically every time it saves a new user in the form of BSON data.
        BSON stands for Binary Javascript Object Notation. It is a binary-encoded serialization of JSON documents.

            Let’s take the following JSON document example:-
                {
                "hello" : "world"
                }

            When storing the JSON document, it will be converted to the following:-
                \x16\x00\x00\x00             // total document size
                \x02                         // 0x02 = type String
                hello\x00                    // field name
                \x06\x00\x00\x00world\x00    // field value (size of value, value, null terminator         
                \x00                         // 0x00 = type EOO ('end of object')
*/

import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"


//1st
import mongoose from 'mongoose'


//2nd
  const userSchema=new mongoose.Schema( //It takes objects.
    {
        userName:{
          type:String,
          required:true,
          unique:true,
          lowercase:true,
          trim:true,
          index:true, //When you want to add a search field option to a field, you can use it.
        },

        email:{
          type:String,
          required:true,
          unique:true,
          lowercase:true,
          trim:true,
        },

        fullName:{
            type:String,
            required:true,
            trim:true,
            index:true, //When you want to add a search field option to a field, you can use it.
        },

        avatar:{
            type:String, //Get URL from cloudinary.
            //Upload images,videos and files in AWS or cloudinary and get URL.
            require:true,
        },

        coverImage:{
            type:String, //Get URL from cloudinary.
            //Upload images,videos and files in AWS or cloudinary and get URL.
        },

        password:{
            type:String,
            required:[true,"Password is required."],//Custom validators
            unique:true,
        },

        watchHistory:{
            type:[
                {
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Video",
                    required:true,
                }
            ]
        },

        refreshToken:{
            type:String
        },
    },
    {timestamps:true}
  ); 


  //For password:-
    //middleware hooks:-
        //Direct encryption of password is not possible, so we use some middleware hooks.like pre , post.
            //Pre :- jesse hii user ka data save hone jarah hai usse just pehle kuch hojaye.
            //Pre middleware functions are executed one after another, when each middleware calls next.
              //Jabb password field save ho raha ho usko leke encrypt kardo.
                userSchema.pre("save",async function(next){
                    //Agar password field pai modification hoo tabhi jake iss code ko execute karo.Nahi toh kuch v small changes hone pai baar baar encrypt karega.
                    if(this.isModified("password")){
                      this.password = await bcrypt.hash(this.password , 10);
                      /*
                        @param data — The data to be encrypted. (String)

                        @param saltOrRounds
                        The salt to be used in encryption. If specified as a number then a salt will be generated with the specified number of rounds and used. (string)

                        @return — A promise to be either resolved with the encrypted data salt or rejected with an Error
                    */
                    }
                  
                    next();

                }) //It takes an event like get,listen,send etc and a callback. 
                //remember use normal fucntion rather than arrow function.
                //because arrow function does not hold context like 'this'.
                //encryption is complex process so we use 'async' here.


    //You can import methods like updateOne,deleteOne etc from mongoose or can create custom methods.
      //Custom methods:-
        //Database main password encrypted form main save hoga and user joo password dega login ke time woh clip-text or String main hoga.
        //For checking password we create this.
        userSchema.methods.isPasswordCorrect= async function(password){
            //bcrypt can check your password also.
            return await bcrypt.compare(password,this.password)
            /*
                @param data — The data to be encrypted. (string)

                @param encrypted data — The data to be compared against. (string)

                @return — A promise to be either resolved with the comparison result salt or rejected with an Error.Basically it gives you true or false.
            */
        }

/*
  //For tokens:-
    > Tokens are used for token-based authentication, which is a process that verifies a user's identity by checking a token. 
    > Tokens are symbolic items that are issued by a trusted source. 
    > They can be physical, like a USB hard key, or digital, like a computer-generated message or digital signature.
    > JWT is bearer token.It acts like a key.
    > jske pass token hai usko data send hoga.
    > JWT takes some inforamtion and gives tokens.
    > You can get information about how to use in thier github.
    > Go to .env file and create ACCESS_TOKEN_SECRET,ACCESS_TOKEN_EXPIRY,REFRESH_TOKEN_SECRET,REFRESH_TOKEN_EXPIRY .
    > Here We use both sessions and cookies.
    > Acess token will not save in databse but Refresh token will save.
    > Both do same work but refresh takes less inforamtion compare to access.
    > Learn difference between access token vs referesh token.
    > Refresh tokens are used to obtain new access tokens for applications that need access to Google APIs beyond the lifetime of a single access token.
    > Continuous access: Users can access applications without needing to re-login frequently.

*/
        //Custom method for generate access token:-
          userSchema.methods.generateAccessToken = function(){
              return jwt.sign(
                //Payload:-
                {
                  //key : from database
                  _id:this._id,
                  email:this.email,
                  username:this.username,
                  fullName:this.fullName
                },

                //access token secret:-
                process.env.ACCESS_TOKEN_SECRET,

                //acess token expiry:-
                {
                  expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
                }
              ) 
          }

        //Custom method for generate refresh token:-
          userSchema.methods.generateRefreshToken = function(){
            return jwt.sign(
              //Payload:-
              {
                //key : from database
                _id:this._id,
              },

              //access token secret:-
              process.env.REFRESH_TOKEN_SECRET,

              //acess token expiry:-
              {
                expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
              }
            ) 
          }


//3rd
  export const User=mongoose.model("User",userSchema) //mongoose please create a model.model takes two parameter.
  //                    Kya model banauu   kisske base pai banauu
  //Why do we do this way? :- sometime we need this schema in different files so.


//Mongoose se hmm model bana tee hein aur jabb finally model connect hojayega database see toh yee files automatically sabse pehle run hooo jata hai and mongoDB main ekk structure tayar hoo jata hai, kii yeee yeee meri headline fields hai aur inke andarr abb data annna suru hoga.

/*
  Note:-[mongoDB standardize form]
  When "User" model stores in database, it converts to lower and plural. --> users
*/