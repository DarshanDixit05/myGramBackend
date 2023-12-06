import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    user_id: {
        type: String,
        ref: 'User',
        required: true,
    },
    hashtags: [
        {
            type: String,
        },
    ],
    timestamp: {
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
});

const Post = mongoose.model('Post', postSchema);
export default Post;