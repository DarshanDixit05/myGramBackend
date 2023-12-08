// Import Dependencies
import mongoose  from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema=new mongoose.Schema({
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
                ref:'Post'
            },
            image:{
                type:String,
                ref:'Post'
            }
        }
    ],
    post_liked:[
        {
            post_id:{
                type:String,
                ref:'Post'
            },
            image:{
                type:String,
                ref:'Post'
            }
        }
    ],
    post_commented:[
        {
            post_id:{
                type:String,
                ref:'Post'
            },
            image:{
                type:String,
                ref:'Post'
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
    profileImage:{
        type:String,
    },
    followers:[
        {
            user_id:{
                type:String,
            },
            username:{
                type:String,
            },
            profileImage:{
                type:String,
            }
        }
    ],
    followings:[
        {
            user_id:{
                type:String,
            },
            username:{
                type:String,
            },
            profileImage:{
                type:String,
            }
        }
    ],
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date
},
{
    timestamps:true
})

// encrypt password before save
userSchema.pre('save',async function(next) {
    if (!this.isModified('password')){
        return next();
    } 
    this.password=await bcrypt.hash(this.password,10)
})

// validate the password with passed on user password
userSchema.methods.isValidatedPassword= async function(usersendPassword, password){
    return await bcrypt.compare(usersendPassword,password);
}

// create and return jwt token
userSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

// generate forget password token (string)
userSchema.methods.getForgotPasswordToken = function(){
    // generate a long and random string
    const forgotToken = crypto.randomBytes(20).toString("hex");

    // getting a hash - make sure to get a hash on backend
    this.forgotPasswordToken=crypto.createHash("sha256").update(forgotToken).digest("hex")

    // time of token
    this.forgotPasswordExpiry=Date.now()+20*60*1000;  // 20 mins to expire password reset token

    return forgotToken;
}

const User = mongoose.model("User",userSchema);
export default User;