import jwt from "jsonwebtoken";
import { User, Book } from "../schema.js";

const bookRoutes = (app) => {
    app.get("/api/books", get_books);
    app.get("/api/book/:id", get_book_detail);
    app.post("/api/books/upload", upload_book);
};

const get_books = async (req, res) => {
    const authorization = req.headers.authorization || null;
    if (authorization === null || authorization.split(" ")[0] !== "Bearer") {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const books = await Book.find({ author: decoded.username });
        return res.status(200).json({ code: 200, message: "success", data: books });
    } catch (error) {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
};

// not finish
const get_book_detail = async (req, res) => {
    const authorization = req.headers.authorization || null;
    if (authorization === null || authorization.split(" ")[0] !== "Bearer") {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
    const book_id = req.params.id;
    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        // 对 book_id 验证是否为 objectid
        if (!book_id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ code: 400, message: "Bad Request", data: null });
        }
        const book = await Book.findOne({ _id: book_id });
        return res.status(200).json({ code: 200, message: "success", data: book });
    } catch (e) {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
};

// not finish
const upload_book = async (req, res) => {
    const authorization = req.headers.authorization || null;
    if (authorization === null || authorization.split(" ")[0] !== "Bearer") {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }

    const { title, author } = req.body;
    if (!title || !author) {
        return res.status(400).json({ code: 400, message: "Missing params", data: null });
    }

    const token = authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await User.findOne({ username: decoded.username });
        const book = new Book({
            title: title,
            author: author,
            uploadedBy: user._id,
        });
    } catch (e) {
        return res.status(401).json({ code: 401, message: "Unauthorized", data: null });
    }
};

export default bookRoutes;
