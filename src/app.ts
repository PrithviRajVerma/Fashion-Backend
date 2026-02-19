import express from "express";
import session from "express-session";
import { requestLogger } from "./api/middlewares/requestLogger";
import { errorHandler } from "./api/middlewares/errorHandler";
import authRoutes from "./api/routes/auth.ts";
import productRoutes from "./api/routes/product.ts";

export const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(
    session({
        secret: String(process.env.SESSION_SECRET || "bun-dev-secret"),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000
        }
    })
);


// Routes
app.get("/", (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Service is alive",
        time: Date.now(),
    });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Route Not Found" });
});

// Global Error Handler
app.use(errorHandler);