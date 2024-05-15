import express from 'express' ;
import {getUsers} from "../controllers/user.controller.js" ;
import protectRoute from '../middleware/protectRoute.js';

const router = express.Router() ;

router.get("/",protectRoute,getUsers) ; //for sidebar
//protect route ensures that unauthenticated users are not able to call 'getUsers'
 
export default router ;