import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId,res) => {
    const token = jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn:"15d",
    });
    //sending token to user cookie
    res.cookie("jwt",token,{ //jwt is the cookie name.
        maxAge:15 * 24 * 60 * 60 * 1000, // in mili-second
        httpOnly:true,//prevent XSS attacks cross-site scripting attacks
        sameSite:"strict",//CSRF attacks cross site request forgery attacks
        secure: process.env.NODE_ENV != "development"
    }) ;
};

export default generateTokenAndSetCookie ;