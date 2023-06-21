import Users from "../models/UserModel.js";
import argon2 from "argon2";

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) return res.status(400).json({ message: "Passwords do not match" });

    const hashPassword = await argon2.hash(password);

    try {
        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        });
        res.status(201).json({ message: "User created" });
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
}

export const getUsers = async (req, res) => {
    try {
        const response = await Users.findAll({
            attributes: ["uuid", "name", "email", "role"]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await Users.findOne({
            attributes: ["uuid", "name", "email", "role"],
            where: {
                uuid: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        const { name, email, password, confPassword, role } = req.body;
        let hashPassword;
        if (password === "" || null) {
            hashPassword = user.password;
        } else {
            hashPassword = await argon2.hash(password);
        }
        if (password !== confPassword) return res.status(400).json({ message: "Passwords do not match" });
        await Users.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ message: "User updated" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const user = await Users.findOne({
            where: {
                uuid: req.params.id
            }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        await Users.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}