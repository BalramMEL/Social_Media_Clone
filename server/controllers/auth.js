import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; 

// REGISTER USER
export const register = async( req, res ) => {         //first it will take request from frontend then through the database and backend it will respond.
    try {
        const {
            firstName,
            lastName,
            email,
            friends,
            password,
            picturePath,
            location,
            occupation
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName,
            lastName,
            email,
            friends,
            password: passwordHash,
            picturePath,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000),
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);          // If upper code is corect it will send status 
                                                 // status code 201 which means something has been created.
    } catch (err) {
        res.status(500).json({ error: err.message });      // Frontend will get error message with help of 500 status code.
    }
};

// LOGGING IN
export const login = async ( req, res ) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email: email}); 
        if(!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(400).json({ msg: "Invalid credentials. "});

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });       //200 means "Request has succeded."
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
