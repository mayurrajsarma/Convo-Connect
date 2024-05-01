import express from "express" ;
import { login, logout, signup } from "../controllers/auth.controller.js";
const router = express.Router() ;

// router.get("/login",(req,res)=> {
//     res.send("Login Route")
// }); instead of this we will use controllers

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);


export default router ;