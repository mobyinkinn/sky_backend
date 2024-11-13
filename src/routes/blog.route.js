import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
} from "../controllers/blog.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/create")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createBlog);

router.route("/get-all").get(getAllBlogs);
router.route("/update").post(verifyJwt, updateBlog);
router.route("/delete").get(verifyJwt, deleteBlog);

export default router;
