import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async(req, res) =>{
    const {id} = req.user;
    const {formData} = req.body;

    try {
        const post = await Post.create({
            caption:formData.caption,
            user_id:id,
            image:formData.image
        })

        return res.status(200).json({
            success:true,
            message:"Post created successfully",
            data:post
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

export const addLike = async(req, res) =>{
    const {postId} = req.params;
    const {id} = req.user;
    
    try {
        const post = await Post.findById(postId);
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User not found"
            })
        }

        if(!post){
            return res.status(401).json({
                success:false,
                message:"Post not found"
            })
        }

        const likedUsers = post.likes;
        if(likedUsers.includes(id)){
            return res.status(401).json({
                success:false,
                message:"You've already liked the post"
            })
        }
        likedUsers.push(id);
        post.likes = likedUsers;
        await post.save();

        user.post_liked.push(postId);
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Liked the post",
            data:post
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}