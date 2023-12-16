import Post from "../models/Post.js";
import User from "../models/User.js";

export const createPost = async(req, res) =>{
    const {id} = req.user;
    const {formData} = req.body;
    try {
        const user = await User.findById(id);
        const post = await Post.create({
            caption:formData.caption,
            userId:id,
            username:user.username,
            profileImage:user.profileImage,
            image:formData.imageUrl
        })

        user.post_uploaded.push(post._id.toString());
        user.save();

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

        if(post.likes.some(like => like._id.toString() === id.toString())){
            return res.status(401).json({
                success:false,
                message:"You've already liked the post"
            })
        }
        post.likes.push(id.toString());
        await post.save();

        user.post_liked.push(postId.toString());
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

export const removeLike = async(req,res) =>{
    const {postId} = req.params;
    const {id} = req.user;

    try {
        const post = await Post.findById(postId);
        const user = await User.findById(id);

        if((post.likes.some(like => like._id.toString() === id.toString())===false) && (user.post_liked.some(like => like._id.toString() === postId.toString())===false)){
            return res.status(401).json({
                success:false,
                message:"You havent liked the post yet"
            })
        }

        post.likes = post.likes.filter((ele)=>{
            return ele.id!==id
        });
        await post.save();

        user.post_liked = user.post_liked.filter((ele)=>ele.id!==postId);
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Unliked the user",
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

export const addComment = async(req, res) =>{
    const {id} = req.user;
    const {postId} = req.params;
    const {comment} = req.body;

    try {
        const user = await User.findById(id);
        const post = await Post.findById(postId);

        if(!user){
            return res.status(401).json({
                success:false,
                message:"No user found"
            })
        }

        if(!post){
            return res.status(401).json({
                success:false,
                message:"No post found"
            })
        }

        const obj = {
            user_id:id.toString(),
            comment:comment
        }
        post.comments.push(obj);
        await post.save();
        user.post_commented.push(postId.toString());
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Comment added",
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

export const removeComment = async(req, res) =>{
    const {id} = req.user;
    const {postId, commentId} = req.params;
    try {
        const post = await Post.findById(postId);
        const user = await User.findById(id);

        if(!user){
            return res.status(401).json({
                success:false,
                message:"No user found"
            })
        }

        if(!post){
            return res.status(401).json({
                success:false,
                message:"No post found"
            })
        }

        if((post.comments.some((ele)=>{
            return (ele._id.toString() === commentId)
        }) === false) && (user.post_commented.some((ele)=>{
            return ele._id.toString() === postId})===false)){
            return res.status(401).json({
                success:false,
                message:"No such comment exists"
            })
        }

        post.comments = post.comments.filter((ele)=>{
            return ele._id.toString() !== commentId
        })
        await post.save();

        user.post_commented = user.post_commented.filter((ele)=>{
            return ele.id!==postId
        })
        await user.save();

        return res.status(200).json({
            success:true,
            message:"Comment removed",
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

export const getPosts = async(req, res) =>{
    const {id} = req.user;
    try {
        const user = await User.findById(id);
        const followersList = user.followings;

        let posts=[];

        for(let i=0; i<followersList.length; i++)
        {
            const obj = await Post.find({user_id:followersList[i].user_id});
            if(obj.length>0)posts.push(obj);
        }

        if(posts.length===0)
        {
            const userPosts = await Post.find({user_id:id});
            return res.status(200).json({
                success:true,
                message:"User posts fetched",
                data:userPosts
            })
        }

        return res.status(200).json({
            success:true,
            message:"Posts fetched",
            data:posts
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}

export const getPostById = async(req, res) =>{
    const {postId} = req.params;
    try {
        const post = await Post.findById(postId);
        if(!post){
            return res.status(401).json({
                success:false,
                message:"No post found"
            })
        }
        
        const postLikes = post.likes.length;
        const postComments = post.comments.length;

        return res.status(200).json({
            success:true,
            message:"Fetched post successfully",
            data:{
                post:post,
                likes:postLikes,
                comments:postComments
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Server error"
        })
    }
}