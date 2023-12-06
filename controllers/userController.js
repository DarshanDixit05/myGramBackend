// Import Model
import User from "../models/User.js"
import {ObjectId} from 'mongodb'

export const createUser = async(req,res)=>{
    const {username,email,password}=req.body;
    if((!username) || (!email) || (!password)){
        return res.status(400).json({
            success:false,
            message:"All fields are required!"
        })
    }

    const existingUser = await User.findOne({email:email})
    if(existingUser){
        return res.status(501).json({
            success:true,
            message:"User Already Exists !",
        })
    }
    else{
        const user=await User.create({
            username,
            email,
            password
        })
    
        return res.status(201).json({
            success:true,
            message:"User Created Successfully !",
            data:user
        })
    }

}

export const checkExistingUser = async(req, res) =>{
    const {inputData, password} = req.body;
    if((!inputData) || (!password)){
        return res.status(400).json({
            success:false,
            message:"All fields are required."
        })
    }

    if(inputData.substr(inputData.length-4)===".com"){
        const user = await User.findOne({email:inputData});
        if(!user){
            return res.status(401).json({message:"Invalid User"});
        }
        const valid = await user.isValidatedPassword(password, user.password);
        if (!valid) return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        })
        const token = await user.getJwtToken();
        return res.status(200).json({
            success:true,
            message:"Logged In Successfully!",
            data:user,token
        });
    }else{
        const user = await User.findOne({username:inputData});
        if(!user)
        {
            return res.status(401).json({message:"Invalid User"});
        }
        const valid = await user.isValidatedPassword(password, user.password);
        if (!valid) return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        })
        const token = await user.getJwtToken();
        return res.status(200).json({
            success:true,
            message:"Logged In Successfully!",
            data:user,token
        });
    }
}

export const updateProfile = async(req, res) =>{
    
}