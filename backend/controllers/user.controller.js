import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        }

        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Profile picture is required",
                success: false,
            });
        }

        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email.",
                success: false,
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: cloudResponse.secure_url,
            },
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred during registration",
            success: false,
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password",
                success: false,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "1d" });

        return res.status(200).cookie("token", token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }).json({
            user: user,
            message: `Welcome back, ${user.fullname}!`,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred during login",
            success: false,
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", {
            httpOnly: true,
            maxAge: 0, // Expire immediately
        }).json({
            message: "Logged out successfully",
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred during logout",
            success: false,
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        let cloudResponse;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        const userId = req.id; // middleware authentication
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false,
            });
        }

        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skills.split(",");

        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Save the cloudinary URL
            user.profile.resumeOriginalName = file.originalname; // Save the original file name
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile,
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "An error occurred during profile update",
            success: false,
        });
    }
};
