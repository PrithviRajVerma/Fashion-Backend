import express from "express";
import session from "express-session";
import { requestLogger } from "./api/middlewares/requestLogger";
import { errorHandler } from "./api/middlewares/errorHandler";
import authRoutes from "./api/routes/authRoutes.ts";

export const app = express();


app.use(express.json());
app.use(requestLogger);
app.use(
    session({
        secret: process.env.SESSION_SECRET as string,
        resave: false,
        saveUninitialized: false,
        name: "app.sid",

        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);


// Routes
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/products", productRoutes);
// app.use("/api/v1/auth", userRoutes);
// app.use("api/v1/admin", adminRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route Not Found" });
});

// Global Error Handler (last)
app.use(errorHandler);
