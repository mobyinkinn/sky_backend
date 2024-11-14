import e from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = e();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credential: true,
  })
);

app.use(e.json({ limit: "16kb" }));
app.use(e.urlencoded({ extended: true, limit: "16kb" }));
app.use(e.static("public"));
app.use(cookieParser());

//routes import
import adminRouter from "./routes/admin.route.js";
import blogRouter from "./routes/blog.route.js";
import eventRouter from "./routes/event.route.js";

//routes declaration
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/event", eventRouter);

export default app;
