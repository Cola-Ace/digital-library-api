import jwt from "jsonwebtoken";
import { User } from "../schema.js";

const userRoutes = (app) => {
    app.post("/api/auth/login", login);
    app.post("/api/auth/register", register);
    app.get("/api/user/profile", get_profile);
    app.put("api/user/profile", put_profile);
    app.put("/api/user/password", edit_password);
};

const login = async (req, res) => {
    const username = req.body.user || null;
    const pass = req.body.password || null;

    if (username === null || pass === null) {
        return res.status(403).json({ code: 403, message: "Missing params", data: null });
    }

    const user = await User.findOne({ username: username });
    if (user === null) {
        return res.status(403).json({ code: 403, message: "Wrong username or password", data: null });
    }

    const is_valid = user.comparePassword(pass);
    if (!is_valid) {
        return res.status(403).json({ code: 403, message: "Wrong username or password", data: null });
    }

    const token = jwt.sign({ username: username, email: user.email, role: user.role }, process.env.JWT_TOKEN, { expiresIn: "1h" });
    return res.status(200).json({ code: 200, message: "success", data: { token: token } });
};

const register = async (req, res) => {
    const username = req.body.user || null;
    const password = req.body.password || null;
    const email = req.body.email || null;
    if (username === null || password === null || email === null) {
        return res.status(403).json({ code: 403, message: "Missing params", data: null });
    }

    try {
        const user_exists = await User.findOne({ username: username });
        if (user_exists !== null) {
            return res.status(403).json({ code: 403, message: "User already exists", data: null });
        }
        const user = new User({
            username: username,
            passwordHash: password,
            email: email,
        });
        await user.save();
        const token = jwt.sign({ username: username, email: email, role: "user" }, process.env.JWT_TOKEN, { expiresIn: "1h" });
        return res.status(200).json({ code: 200, message: "success", data: { token: token } });
    } catch (e) {
        console.log(e);
        return res.status(403).json({ code: 403, message: "Something wrong", data: null });
    }
};

const get_profile = async (req, res) => {
    const authorization = req.headers.authorization || null;
    if (authorization === null || authorization.split(" ")[0] !== "Bearer") {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({ username: decoded.username });
        if (user === null) {
            return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
        }
        // 从 user 里删除 passwordHash, _id, __v
        delete user._doc.passwordHash;
        delete user._doc._id;
        delete user._doc.__v;

        return res.status(200).json({ code: 200, message: "success", data: user });
    } catch (e) {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
};

// not finish
const put_profile = async (req, res) => {
    const authorization = req.headers.authorization || null;
    if (authorization === null || authorization.split(" ")[0] !== "Bearer") {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({ username: decoded.username });
        if (user === null) {
            return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
        }

        return res.status(200).json({ code: 200, message: "success", data: null });
    } catch (e) {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
};

const edit_password = async (req, res) => {
    const authorization = req.headers.authorization || null;
    if (authorization === null || authorization.split(" ")[0] !== "Bearer") {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
    const old_password = req.body.old_password || null;
    const new_password = req.body.new_password || null;
    if (old_password === null || new_password === null) {
        return res.status(403).json({ code: 403, message: "Missing params", data: null });
    }

    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({ username: decoded.username });
        if (user === null) {
            return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
        }
        const is_valid = user.comparePassword(old_password);
        if (!is_valid) {
            return res.status(403).json({ code: 403, message: "Wrong old password", data: null });
        }
        user.passwordHash = new_password;
        await user.save();
        return res.status(200).json({ code: 200, message: "success", data: null });
    } catch (e) {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
};

export default userRoutes;
