import {v2 as cloudinary} from 'cloudinary';

import fs from "fs";
/*
    > The Node. js file system (fs) module has many methods to help with many low-level tasks.
    > You can perform various file operations like create, write, rename, copy, move, delete, and many more.
    > You can do several directory operations like create, temporary directory, move, and many more.

    >Mainly we need the path of the file.
    
    >Learn about "fsPromises.unlink(path)".
        path <string> | <Buffer> | <URL>
        Returns: <Promise> Fulfills with undefined upon success.

        - If path refers to a symbolic link, then the link is removed without affecting the file or directory to which that link refers.
        - If the path refers to a file path that is not a symbolic link, the file is deleted.
*/


// > Set cloud_name,api_key,_api_secret in .env file.

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
  });


// We create a method that takes a path as a parameter. Then it will upload in 'Cloudinary'.If successfuly upload then unlink the file from server.
// It takes time to upload so we use async.
const uploadOnCloudinary= async(localFilePath)=>{
    try {
        if(!localFilePath){
            return null;
        }
        else{
            //upload file:-
                //Learn how to upload and what type of options you can give in upload().
            const response=await cloudinary.uploader.upload(localFilePath,
                { resource_type:"auto" }
            );

            //file has been uploaded successfuly and print URL in console.
            console.log("file has been uploaded successfuly",response.url);

            // //after uploaded successfuly in cloudinary unlink/remove the file from server.
            // fs.unlinkSync(localFilePath);

            return response;
        }
    } 
    catch (error) {
        //unlink the file.
        //Remove the locally saved temporary file as the upload opeartions got failed.
        //fs.unlinkSync(localFilePath); //unlink in syncronous way.
        return null;
    }
}

/*
    cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    { public_id: "olympic_flag" }, 
    function(error, result) {console.log(result); });
*/


// We create a method that takes a path as a parameter. Then it will delete old files in 'Cloudinary'.
// It takes time to delete so we use async.
const deleteOnCloudinary= async(localFilePath)=>{
    try {
        if(!localFilePath){
            return null;
        }
        else{
            //delete file:-
                //Learn how to delete and what type of options you can give in delete().
                // To delete a file in Cloudinary using its file path, you still need to use the public_id of the file. Cloudinary does not use the file path directly for deletion, but rather the public_id that corresponds to the uploaded file.

                //Steps:-
                    //1. Extract the public_id from the File Path.
                    //2. Delete the File Using the Extracted public_id.

                //syntax:-
                    //cloudinary.v2.uploader.destroy(public_id, options).then(callback);

                // Extract the public_id from the file path (remove the file extension)
                const url_array = localFilePath.split('/');
                console.log("url array = ",url_array);

                const image=url_array[url_array.length-1];
                console.log(image);

                const public_id=image.split('.')[0]

                console.log("Public id = ",public_id);

            const response=await cloudinary.uploader.destroy(public_id,
            );

            return response;
        }
    } 
    catch (error) {
        return null;
    }
}

export {uploadOnCloudinary,deleteOnCloudinary} 