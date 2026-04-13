import { AppDataSource } from "../config/data-source.js";
import logger from "../config/logger.js";

// Lister les products
export const getProducts = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Product");

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 1;
  const skip = (page - 1) * limit;

  const [products, total] = await repo.findAndCount({
   skip,
   take: limit,
   relations: ["category"],
  });

  logger.info(`GET /products - Found ${products.length} products (Total: ${total})`);

  res.json({
   data: products,
   total,
   page,
   limit,
   lastPage: Math.ceil(total / limit),
  });
 } catch (error) {
  logger.error(`GET /products - Error: ${error.message}`);
  res.status(500).json({
   message: "Error fetching products",
   error: error.message,
  });
 }
};




// Ajouter un product
export const addProduct = async (req, res) => {
 try {
  const { name, price, stock, category } = req.body;
  if (!name) {
   return res.status(400).json({
    message: "Name is required",
   });
  }

  if (price === undefined || price <= 0) {
   return res.status(400).json({
    message: "Price must be greater than 0",
   });
  }

  if (stock === undefined || stock < 0) {
   return res.status(400).json({
    message: "Stock must be >= 0",
   });
  }

  const repo = AppDataSource.getRepository("Product");

  const newProduct = repo.create({
   name,
   price,
   stock,
   category,
  });

  await repo.save(newProduct);
  logger.info(`Product added: ${newProduct.name}`);

  logger.info(`POST /products - Product Created: ${newProduct.name} (ID: ${newProduct.id})`);

  res.status(201).json(newProduct);
 } catch (error) {
  logger.error(`Error creating product: ${error}`);
  res.status(500).json({
   message: "Error creating product",
   error: error.message,
  });
 }
};

// Product By id
export const getProductById = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Product");
  const product = await repo.findOneBy({
   id: parseInt(req.params.id),
  });

  if (!product) {
   logger.warn(`GET /products/${id} - Product not found`);
   return res.status(404).json({
    message: "Product not found",
   });
  }
  logger.info(`GET /products/${id} - Product found: ${product.name}`);
  res.json(product);
 } catch (error) {
  logger.error(`GET /products/${req.params.id} - Error: ${error.message}`);
  res.status(500).json({
   message: "Error fetching product",
   error: error.message,
  });
 }
};

// Update Product
export const updateProduct = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Product");

  const product = await repo.findOneBy({
   id: parseInt(req.params.id),
  });

  if (!product) {
   logger.warn(`PUT /products/${id} - Update failed: Product not found`);
   return res.status(404).json({
    message: "Product not found",
   });
  }

  const { name, price, stock } = req.body;
  if (name !== undefined && name.trim() === "") {
   return res.status(400).json({
    message: "Name cannot be empty",
   });
  }

  if (price !== undefined && price <= 0) {
   return res.status(400).json({
    message: "Price must be greater than 0",
   });
  }

  if (stock !== undefined && stock < 0) {
   return res.status(400).json({
    message: "Stock must be >= 0",
   });
  }

  repo.merge(product, req.body);
  const updatedProduct = await repo.save(product);
  logger.info(`PUT /products/${id} - Product updated successfully`);
  res.json(updatedProduct);
 } catch (error) {
  logger.error(`PUT /products/${req.params.id} - Error: ${error.message}`);
  res.status(500).json({
   message: "Error updating product",
   error: error.message,
  });
 }
};


// Delete Product
export const deleteProduct = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Product");

  const product = await repo.findOneBy({
   id: parseInt(req.params.id),
  });

  if (!product) {
   logger.warn(`DELETE /products/${req.params.id} - Delete failed: Product not found`);
   return res.status(404).json({
    message: "Product not found",
   });
  }

  await repo.delete(product);
  logger.info(`DELETE /products/${req.params.id} - Product deleted successfully`);
  res.json({
   message: "Product deleted successfully",
  });
 } catch (error) {
  logger.error(`DELETE /products/${req.params.id} - Error: ${error.message}`);
  res.status(500).json({
   message: "Error deleting product",
   error: error.message,
  });
 }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
 try {
  const repo = AppDataSource.getRepository("Product");

  const { name } = req.params;

  const products = await repo
   .createQueryBuilder("product")
   .leftJoinAndSelect("product.category", "category")
   .where("category.name = :name", { name })
   .getMany();

  logger.info(`GET /products/category/${name} - Found ${products.length} products in category '${name}'`);
  res.json(products);
 } catch (error) {
logger.error(`GET /products/category/${req.params.name} - Error: ${error.message}`);
  res.status(500).json({
   message: "Error fetching products by category",
   error: error.message,
  });
 }
};