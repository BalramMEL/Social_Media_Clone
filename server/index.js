import express from "express";          // It's for library
import bodyParser from "body-parser";   //To process request body
import mongoose from "mongoose";        //For MongoDB access    
import cors from "cors";                // For cross origin request            
import dotenv from "dotenv";
import multer from "multer";            // for upload file locally    
import helmet from "helmet";            // for request safety    
import morgan from "morgan";            //for login
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js"; 
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

// CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));   // It sets the directory on where we keep our assets where we store it locally
 // In actual production we store assets in actual storage.

 
 //FILE STORAGE
const storage = multer.diskStorage({
    destination: function (req, file, cb){        // => When someone upload a file then it store in 
        cb(null, "public/assets");               // this place.  
    },                                        
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});

// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//       cb(null, __dirname);
//     },
//     filename: function(req, file, cb) {
//       cb(null, new Date().toISOString() + file.originalname);
//     }
//   });

const upload = multer({ storage });    // It will help us to save and upload file.

//ROUTES WITH FILES
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

//ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

// MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL, {                      //Process.env. 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    //ADD DATA ONE TIME
    // User.insertMany(users);
    // Post.insertMany(posts);
})
.catch((error) => console.log(`${error} did not connect`));