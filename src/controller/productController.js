import { AppDataSource } from "../config/data-source.js";

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

  res.json({
   data: products,
   total, 
   page,
   limit,
   lastPage: Math.ceil(total / limit),
  });
 } catch (error) {
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

  res.status(201).json(newProduct);
 } catch (error) {
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
   return res.status(404).json({
    message: "Product not found",
   });
  }

  res.json(product);
 } catch (error) {
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

  res.json(updatedProduct);
 } catch (error) {
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
   return res.status(404).json({
    message: "Product not found",
   });
  }

  await repo.delete(product);

  res.json({
   message: "Product deleted successfully",
  });
 } catch (error) {
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

  res.json(products);
 } catch (error) {
  res.status(500).json({
   message: "Error fetching products by category",
   error: error.message,
  });
 }
};