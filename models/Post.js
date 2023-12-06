import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    image:{
        type:String,
    },
    caption: {
        type: String,
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likes: [
        {
            user_id: {
                type: String,
                ref: 'User',
            },
        },
    ],
    comments: [
        {
            user_id: {
                type: String,
                ref: 'User',
            },
            comment: {
                type: String,
            },
        },
    ],
},
{
    timestamps:true
});

const Post = mongoose.model('Post', postSchema);
export default Post;