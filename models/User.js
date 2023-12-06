// Import Dependencies
import mongoose  from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        maxlength:[40,'Name should be under 40 characters.']
    },
    username:{
        type:String,
        required:true,
        maxlength:[40,'Name should be under 40 characters.'],
        unique:true
    },
    email:{
        type:String,
        required:[true,'Please provide an email'],
        validate:[validator.isEmail,'Please enter email in correct format'],
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"Password should be of atleast 6 characters."],
    },
    post_uploaded:[
        {
            post_id:{
                type:String,
                ref:'Post',
                required:true,
            }
        }
    ],
    post_liked:[
        {
            post_id:{
                type:String,
                ref:'Post',
                required:true,
            }
        }
    ],
    post_commented:[
        {
            post_id:{
                type:String,
                ref:'Post',
                required:true,
            }
        }
    ],
    profile_image:{
        data:Buffer,
        contentType:String,
    },
    bio:{
        type:String,
    },
    followers:[
        {
            user_id:{
                type:String,
                required:true
            }
        }
    ],
    followings:[
        {
            user_id:{
                type:String,
                required:true
            }
        }
    ]
})

const User = mongoose.model("User",userSchema);
export default User;