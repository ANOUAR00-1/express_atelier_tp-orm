import { AppDataSource } from "../config/data-source.js";

// Lister les categories
export const getCategories = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Category");
  const categories = await repo.find();

  res.json(categories);
 } catch (error) {
  res.status(500).json({
   message: "Error fetching categories",
   error: error.message,
  });
 }
};

// Ajouter category
export const addCategory = async (req, res) => {
 try {
  const { name, description } = req.body;

  if (!name) {
   return res.status(400).json({
    message: "Name is required",
   });
  }

  const repo = AppDataSource.getRepository("Category");

  const newCategory = repo.create({
   name,
   description,
  });

  await repo.save(newCategory);

  res.status(201).json(newCategory);
 } catch (error) {
  res.status(500).json({
   message: "Error creating category",
   error: error.message,
  });
 }
};

// Category By id
export const getCategoryById = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Category");

  const category = await repo.findOne({
   where: { id: parseInt(req.params.id) },
   relations: ["products"],
  });

  if (!category) {
   return res.status(404).json({
    message: "Category not found",
   });
  }

  res.json(category);
 } catch (error) {
  res.status(500).json({
   message: "Error fetching category",
   error: error.message,
  });
 }
};

// Update category
export const updateCategory = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Category");

  const category = await repo.findOneBy({
   id: parseInt(req.params.id),
  });

  if (!category) {
   return res.status(404).json({
    message: "Category not found",
   });
  }

  const { name } = req.body;

  if (name !== undefined && name.trim() === "") {
   return res.status(400).json({
    message: "Name cannot be empty",
   });
  }

  repo.merge(category, req.body);
  const updatedCategory = await repo.save(category);

  res.json(updatedCategory);
 } catch (error) {
  res.status(500).json({
   message: "Error updating category",
   error: error.message,
  });
 }
};

// Delete category
export const deleteCategory = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Category");

  const category = await repo.findOneBy({
   id: parseInt(req.params.id),
  });

  if (!category) {
   return res.status(404).json({
    message: "Category not found",
   });
  }

  await repo.delete(category);

  res.json({
   message: "Category deleted successfully",
  });
 } catch (error) {
  res.status(500).json({
   message: "Error deleting category",
   error: error.message,
  });
 }
};

// getCategoriesProducts
export const getCategoriesProducts = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Category");

  const category = await repo.findOne({
   where: { id: parseInt(req.params.id) },
   relations: ["products"],
  });

  if (!category) {
   return res.status(404).json({
    message: "Category not found",
   });
  }

  res.json(category.products);
 } catch (error) {
  res.status(500).json({
   message: "Error fetching category products",
   error: error.message,
  });
 }
}
