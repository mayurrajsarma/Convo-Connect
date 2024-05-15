import express from "express" ;
import {getMessage, sendMessage} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router() ;

//before we run 'sendMessage' we check if the user is logged in => protectRoute
router.get("/:id",protectRoute,getMessage);

router.post("/send/:idinlink",protectRoute,sendMessage);

export default router ;