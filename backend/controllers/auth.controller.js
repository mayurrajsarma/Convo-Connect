import bcrypt from "bcryptjs" ;
import User from "../models/user.model.js";

export const signup = async (req,res) => {
    try {
       const {fullName,username,password,confirmPassword,gender} = req.body ; 
        if(password!==confirmPassword){
            return res.status(400).json({error:"Passwords don't match"}) ; 
        }
        const user = await User.findOne({username}) ;
        if(user) {
                return res.status(400).json({error:"Username already exists"}) ;
        }
        //HASH PASSWORD HERE
        const salt = await bcrypt.genSalt(10) ;// higher the no. more secure, but slower
        const hashedPassword = await bcrypt.hash(password,salt) ;
        
        //api for random profile pic
        const boyPic = `https://avatar.iran.liara.run/public/boy?username=${username}` ;
        const girlPic = `https://avatar.iran.liara.run/public/girl?username=${username}` ;

        const newUser = new User({
            fullName, // fullname:fullname
            username,
            password : hashedPassword,
            gender,
            profilePic: gender === "male" ? boyPic : girlPic ,
        }) ;

        if(newUser) {
            //Generate JWT token here
            await newUser.save() ;

            res.status(201).json({
                _id:newUser._id,
                fullname: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        }
        else{
            res.status(400).json({error: "Invalid user data"}) ;
        }

    } catch (error) {
        console.log("Error in signup controller",error.message) ;
        res.status(500).json({error:"Internal server error"}) ;
    }
};

export const login = (req,res) => {
    res.send("Login") ;
    console.log("Login User");
}
export const logout = (req,res) => {
    res.send("Logout  ") ;
    console.log("Logout User");
}
