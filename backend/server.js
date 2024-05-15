import express from "express" ;
import dotenv from "dotenv" ;
import authRoutes from "./routes/auth.routes.js" ;
import messageRoutes from "./routes/message.routes.js " ;
import userRoutes from "./routes/user.routes.js" ; 
import connectToMongoDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";

const app = express() ;
const PORT = process.env.PORT || 8080

dotenv.config() ;



// app.get("/api/auth/signup", (req,res)=> {
//     console.log("Signup route") ;
// });
// app.get("/api/auth/login", (req,res)=> {
//     console.log("Login route") ;
// });
// app.get("/api/auth/logout", (req,res)=> {
//     console.log("Logout route") ;
// });

// This looks ugly (above) so we use middleware for this .

app.use(express.json()) ;// to parse the incoming requests from req.body with JSON payload
app.use("/api/auth", authRoutes) ; // whenever we visit anything starting with api/auth we will go to authRoutes
app.use(cookieParser()) ;
app.use("/api/messages", messageRoutes) ;
app.use("/api/users", userRoutes) ;

// app.get("/",(req,res)=> {
//     //root route http://localhost:8080/
//     res.send("Server is running fine") ;
// });

app.listen(PORT, () => {
    connectToMongoDB() ;
    console.log(`Server running on port ${PORT}`)
}) ;