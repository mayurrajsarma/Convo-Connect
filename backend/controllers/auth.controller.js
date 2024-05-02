import bcrypt from "bcryptjs" ;
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";

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
            generateTokenAndSetCookie(newUser._id,res) ;
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

export const login = async (req,res) => {
    try {
        const {username, password} = req.body ;
        const theuser = await User.findOne({username}) ;
        const isPasswordCorrect = await bcrypt.compare(password,theuser?.password || "") ;//password: password from input , theuser.password: password from DB
        
        if(!theuser || !isPasswordCorrect) {
            return res.status(400).json({error: "Invalid username or password"}) ;
        }
        console.log("Logged In!")
        generateTokenAndSetCookie(theuser._id,res);

        res.status(201).json({
            _id:theuser._id,
            fullname: theuser.fullName,
            username: theuser.username,
            profilePic: theuser.profilePic
        });

    } catch (error) {
        console.log("Error in Login controller",error.message) ;
        res.status(500).json({error:"Internal server error"}) ;
    }
}


export const logout = (req,res) => {
    try {
        res.cookie("jwt","",{maxAge: 0}) ;
        res.status(200).json({message: "Logged out successfully"}) ;
    } catch (error) {
        console.log("Error in Logout controller",error.message) ;
        res.status(500).json({error:"Internal server error"}) ;
    }
}
