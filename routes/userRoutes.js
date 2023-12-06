import express from "express"
const router = express.Router()
import {createUser, checkExistingUser} from "../controllers/userController.js"
import {jwtToken} from "../middlewares/jwtToken.js"

router.route("/signup").post(createUser);
router.route("/login").post(checkExistingUser);

export default router;