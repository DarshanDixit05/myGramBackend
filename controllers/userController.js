// Import Model
import User from "../models/User.js"

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
    const {id} = req.user;
    const {username, bio} = req.body;
    try {
        const user = await User.findById(id);
        if(!user){
            return res.status(401).json({
                success:false,
                message:"No user exists"
            })
        }
        const obj = {
            username,
            bio
        }
        Object.assign(user, obj);
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Profile updated",
            data:user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

export const forgotPassword = async(req, res) =>{
    const {inputData} = req.body;
    try {
        let user;
        if(inputData.substr(inputData.length-4)===".com"){
            user = await User.findOne({email:inputData});
        }else{
            user = await User.findOne({username:inputData});
        }
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }

        const forgotPasswordToken = Math.random().toString(36).slice(2);
        const forgotPasswordExpiry = new Date(Date.now() + 3600000);

        user.forgotPasswordToken = forgotPasswordToken;
        user.forgotPasswordExpiry = forgotPasswordExpiry;

        user.save();

        return res.status(200).json({
            success:true,
            message:"Forgot password updated successfully.",
            data:user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

export const resetPassword = async(req, res) =>{
    const {token} = req.params;
    const {newPassword} = req.body;
    console.log(token+" "+newPassword);
    try {
        const user = await User.findOne({forgotPasswordToken:token, forgotPasswordExpiry:{
            $gt:new Date()
        }})
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }
        user.password = newPassword;
        user.forgotPasswordToken=null;
        user.forgotPasswordExpiry=null;

        user.save();
        return res.status(200).json({
            success:true,
            message:"Password updated successfully",
            data:user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

export const followUser = async(req, res) =>{
    const {id} = req.user;
    const {peerId} = req.params;
    try {
        const user = await User.findById(id);
        const peer = await User.findById(peerId);
        if(!peer){
            return res.status(401).json({
                success:false,
                message:"No user found"
            })
        }

        if(user.followings.some((ele)=> ele.user_id === peerId)){
            return res.status(401).json({
                success:false,
                message:"User already in your following list"
            })
        }

        const userObj = {
            user_id:peerId
        }

        user.followings.push(userObj);
        user.save();

        const peerObj = {
            user_id:id
        }

        peer.followers.push(peerObj);
        peer.save();
        return res.status(200).json({
            success:true,
            message:"Followed user successfully",
            data:user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

export const unfollowUser = async(req,res) =>{
    const {id} = req.user;
    const {peerId} = req.params;

    try {
        const user = await User.findById(id);
        const peer = await User.findById(peerId);

        if(!peer){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }

        if(user.followings.some((ele)=> ele.user_id === peerId)===false){
            return res.status(401).json({
                success:false,
                message:"User is not in your following list"
            })
        }

        user.followings = user.followings.filter((ele)=>{
            return ele.user_id !== peerId
        })
        user.save();
        
        peer.followers = peer.followers.filter((ele)=>{
            return ele.user_id !== id;
        })
        peer.save();

        return res.status(200).json({
            success:true,
            message:"Unfollowed successfully",
            data:user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}