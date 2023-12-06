import express from "express"
const router = express.Router()
import {createPost, addLike, removeLike, addComment, removeComment} from "../controllers/postController.js"
import {jwtToken} from "../middlewares/jwtToken.js"

router.route("/createPost").post(jwtToken, createPost);
router.route("/addLike/:postId").post(jwtToken, addLike);
router.route("/removeLike/:postId").post(jwtToken, removeLike);
router.route("/addComment/:postId").post(jwtToken, addComment);
router.route("/removeComment/:postId/:commentId").post(jwtToken, removeComment);

export default router;