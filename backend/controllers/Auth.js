import User from "../models/UserModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!user) return res.status(404).json({
        message: "User not found"
    })
    const isPasswordCorrect = await argon2.verify(user.password, req.body.password)
    if (!isPasswordCorrect) return res.status(400).json({
        message: "Incorrect password"
    })
    req.session.userId = user.uuid
    const uuid = user.uuid
    const name = user.name
    const email = user.email
    const role = user.role
    return res.status(200).json({
        message: "Logged As:",
        uuid,
        name,
        email,
        role
    })
}

export const Me = async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({
            message: "You are not logged in"
        })
    }
    const user = await User.findOne({
        attributes: ['uuid', 'name', 'email', 'role'],
        where: {
            uuid: req.session.userId
        }
    })
    if (!user) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    return res.status(200).json(user)
}

export const Logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({
            message: "Failed to log out"
        })
        return res.status(200).json({
            message: "Logged out"
        })
    })
}