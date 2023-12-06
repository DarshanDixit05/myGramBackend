import express from "express"
const router = express.Router()
import {createPost, addLike} from "../controllers/postController.js"
import {jwtToken} from "../middlewares/jwtToken.js"

router.route("/createPost").post(jwtToken, createPost);
router.route("/addLike/:postId").post(jwtToken, addLike);

export default router;