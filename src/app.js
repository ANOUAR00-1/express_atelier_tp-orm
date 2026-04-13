import express from "express"
import productRoutes from "./routes/productRoutes.js"
import categoryRoutes from './routes/categoryRoutes.js'

const app = express()

app.use(express.json())

app.use("/api/product", productRoutes)
app.use("/api/categories", categoryRoutes)

export default app