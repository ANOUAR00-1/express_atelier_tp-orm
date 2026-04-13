import express from "express"
import {
 getProducts,
 addProduct,
 getProductById,
 updateProduct,
 deleteProduct,
 getProductsByCategory
} from "../controller/productController.js"
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", verifyToken, addProduct);
router.get("/:id", getProductById);
router.get("/category/:name", getProductsByCategory);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router
