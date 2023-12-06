import express from "express"
const router = express.Router()
import {createUser, checkExistingUser} from "../controllers/userController.js"

router.route("/signup").post(createUser);
router.route("/login").post(checkExistingUser);

export default router;