//1st import mongoose
//mongoose helps us to create schema.
//3rd Export schema.

/*
    MongoDB generates a unique video ID automatically every time it saves a new video in the form of BSON data.
*/

//1st:-
import mongoose, { Schema } from 'mongoose'

/*
How to use "mongoose-aggregate-paginate-v2":-
    >We use this as a plugin.
    >Plugins are a tool for reusing logic in multiple schemas. Suppose you have several models in your database and want to add a 'loadedAt' property to each one. Just create a plugin once and apply it to each Schema
    >You can create your own plugins using mongoose or you can import it from mongoose.
        -1st import it.
        -2nd use plugins before export of "Video model".
*/
    //first:-
    import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


//2nd:-
  const videoSchema=new mongoose.Schema( //It takes objects.
    {
        videoFile:{
            type:String,
            //mongoDB is a strong database.You can store your images,pdfs,videos in buffer format.But acctualy you donot need to store because it makes the database heavier.Databases donot make for storing buffer values.Either we create a folder of images,save them in it, and provide it's public URL or use a third party services like AWS/Cloudinary.
            //We add images into the bucket of AWS and it gives us a response of public URL which will be stored in database.
            required:true,
        },

        thumbnail:{
            type:String,
            required:true,
        },

        title:{
            type:String,
            required:true,
        },

        description :{
            type:String,
            require:true,
        },

        duration:{
            type:Number, //We will get this from cloudinary.When cloudinary inserts a video , it will give you a bunch of information about that video like url,duration-time etc.
            require:true,
        },

        views:{
            type:Number,
            default:0,
        },

        isPublished:{
            type:Boolean,
            default:true,
        },

        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {timestamps:true}
    );


    //second:-
    videoSchema.plugin(mongooseAggregatePaginate);
    //Using this pulgin we can access basic mongoose methods as well as aggregate-paginate methods.


//3rd:-
  export const Video=mongoose.model("Video",videoSchema)


/*
  Note:-[mongoDB standardize form]
  When "Video" model stores in database, it converts to lower and plural. --> videos
*/