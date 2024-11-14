import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  blockBlog,
  UnblockBlog,
} from "../controllers/blog.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/create")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createBlog);

router.route("/get-all").get(getAllBlogs);
router.route("/block-blog/:id").put(blockBlog);
router.route("/unblock-blog/:id").put(UnblockBlog);
router.route("/update/:id").put(updateBlog);
router.route("/delete/:id").delete(deleteBlog);

export default router;
