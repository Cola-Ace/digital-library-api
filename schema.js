import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    avatar: { type: String },
    role: { type: String, enum: ["user", "creator", "admin"], default: "user" },
    books: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    works: [{ type: Schema.Types.ObjectId, ref: "Work" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return this.passwordHash === candidatePassword;
};

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    format: {
        type: String,
        enum: ["pdf", "epub", "mobi", "docx"],
        required: true,
    },
    fileUrl: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tags: [{ type: String }],
    metadata: { publisher: { type: String }, publicationDate: { type: Date } },
    isPublished: { type: Boolean, default: false },
    status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
    },
    ratings: [{ type: Schema.Types.ObjectId, ref: "Rating" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const workSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String },
    chapters: [
        {
            title: { type: String },
            content: { type: String },
            order: { type: Number },
        },
    ],
    status: {
        type: String,
        enum: ["draft", "published", "private"],
        default: "draft",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const commentSchema = new Schema({
    content: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    createdAt: { type: Date, default: Date.now },
});

const ratingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
});

const categorySchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
});

const recommendationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recommendedBooks: [{ type: Schema.Types.ObjectId, ref: "Book" }],
    createdAt: { type: Date, default: Date.now },
});

const taggingSchema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    tags: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

const offlineDataSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    progress: { type: Number, default: 0 }, // Reading progress as a percentage (0-100)
    bookmarks: [
        {
            chapterId: { type: Schema.Types.ObjectId, ref: "Chapter" },
            timestamp: { type: Date },
        },
    ],
    lastAccessed: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

const draftSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    workId: { type: Schema.Types.ObjectId, ref: "Work", required: true },
    content: { type: String }, // Draft content for a work
    createdAt: { type: Date, default: Date.now },
});

const fileSchema = new Schema({
    fileName: { type: String, required: true },
    fileType: { type: String, required: true }, // e.g., pdf, epub, mobi
    fileUrl: { type: String, required: true }, // URL to the stored file
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    uploadedAt: { type: Date, default: Date.now },
});

// 导出 es 模块
export const User = mongoose.model("User", userSchema);
export const Book = mongoose.model("Book", bookSchema);
export const Work = mongoose.model("Work", workSchema);
export const Comment = mongoose.model("Comment", commentSchema);
export const Rating = mongoose.model("Rating", ratingSchema);
export const Category = mongoose.model("Category", categorySchema);
export const Recommendation = mongoose.model("Recommendation", recommendationSchema);
export const Tagging = mongoose.model("Tagging", taggingSchema);
export const OfflineData = mongoose.model("OfflineData", offlineDataSchema);
export const Draft = mongoose.model("Draft", draftSchema);
export const File = mongoose.model("File", fileSchema);
