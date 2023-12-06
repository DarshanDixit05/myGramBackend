import express from "express"
const router = express.Router()
import {createPost, addLike, removeLike} from "../controllers/postController.js"
import {jwtToken} from "../middlewares/jwtToken.js"

router.route("/createPost").post(jwtToken, createPost);
router.route("/addLike/:postId").post(jwtToken, addLike);
router.route("/removeLike/:postId").post(jwtToken, removeLike);

export default router;