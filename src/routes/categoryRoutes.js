import express from "express"
import {
 getCategories,
 getCategoriesProducts, 
 addCategory,
 getCategoryById,
 updateCategory,
 deleteCategory
} from "../controller/categoryController.js"

const router = express.Router();

router.get("/", getCategories);
router.get("/:id/products", getCategoriesProducts);
router.post("/", addCategory);
router.get("/:id", getCategoryById);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router
