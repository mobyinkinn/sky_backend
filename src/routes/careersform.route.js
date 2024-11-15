import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createCareers, deleteCareersappl, getAllCareers,  } from "../controllers/careersform.controllers.js";

const router = Router();

router
  .route("/fill-form")
  .post(upload.fields([{ name: "file", maxCount: 1 }]), createCareers);
// router
//   .route("/update-image/:id")
//   .post(upload.fields([{ name: "image", maxCount: 1 }]), updateImage);
router.route("/get-all-careers").get(getAllCareers);
router.route("/delete/:id").delete(deleteCareersappl);
// router.route("/update/:id").post(updateBlog);

export default router;
