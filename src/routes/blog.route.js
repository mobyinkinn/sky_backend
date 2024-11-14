import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
  blockBlog,
  UnblockBlog,
  updateImage,
  getBlogBySlug,
} from "../controllers/blog.controllers.js";

const router = Router();

router
  .route("/create")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createBlog);
router
  .route("/update-image/:id")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), updateImage);
router.route("/get-all").get(getAllBlogs);
router.route("/block-blog/:id").put(blockBlog);
router.route("/get-by-slug/:slug").get(getBlogBySlug);
router.route("/unblock-blog/:id").put(UnblockBlog);
router.route("/delete/:id").delete(deleteBlog);
router.route("/update/:id").post(updateBlog);

export default router;
