import userRoutes from "./user.js";
import bookRoutes from "./book.js";
import workRoutes from "./work.js";
import aiRoutes from "./ai.js";
import permissionRoutes from "./permission.js";
import categoryRoutes from "./category.js";
import ratingCommentRoutes from "./rating_comment.js";
import offlineRoutes from "./offline.js";
import tagRoutes from "./tag.js";

export default function routes(app) {
    userRoutes(app);
    bookRoutes(app);
    workRoutes(app);
    aiRoutes(app);
    permissionRoutes(app);
    categoryRoutes(app);
    ratingCommentRoutes(app);
    offlineRoutes(app);
    tagRoutes(app);
}
