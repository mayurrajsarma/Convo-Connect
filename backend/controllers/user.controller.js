import User from "../models/user.model.js";

export const getUsers = async (req,res) => {
    try {
        const loggedInUserId = req.user._id ;
        const allUsers = await User.find();

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUserId} // $ne => not equal to
        }).select("-password"); //find all the user in the db except the logged in user.
        
        res.status(200).json(filteredUsers) ;
    
    } catch (error) {
        console.log("Error in getUser controller:",error.message)
        res.status(500).json({error:"Interval server error"}) ;
    }
}