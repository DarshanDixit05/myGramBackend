import express from "express"
const router = express.Router()
import {createUser, checkExistingUser, updateProfile, followUser, unfollowUser} from "../controllers/userController.js"
import {jwtToken} from "../middlewares/jwtToken.js"

router.route("/signup").post(createUser);
router.route("/login").post(checkExistingUser);
router.route("/updateProfile").put(jwtToken, updateProfile);
router.route("/followUser/:peerId").post(jwtToken, followUser);
router.route("/unfollowUser/:peerId").post(jwtToken, unfollowUser);
export default router;