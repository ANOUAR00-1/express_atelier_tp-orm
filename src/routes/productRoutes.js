import express from "express"
import {
 getProducts,
 addProduct,
 getProductById,
 updateProduct,
 deleteProduct,
 getProductsByCategory
} from "../controller/productController.js"

const router = express.Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.get("/:id", getProductById);
router.get("/category/:name", getProductsByCategory);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router
