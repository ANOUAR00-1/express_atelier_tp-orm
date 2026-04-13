import express from "express"
import productRoutes from "./routes/productRoutes.js"
import categoryRoutes from './routes/categoryRoutes.js'
import authRoutes from "./routes/authRoutes.js"
import logger from "./config/logger.js"

const app = express()

app.use(express.json())

app.use("/api/product", productRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/auth", authRoutes);

// Exception Handling Middleware
app.use((err, req, res, next) => {
 logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
 res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
})

export default app