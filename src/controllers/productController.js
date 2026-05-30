const Category = require("../models/Category");
const Product = require("../models/Product");
const buildProductFilter = require("../utils/buildFilter");
const { sendSuccess } = require("../utils/apiResponse");

const ensureCategoryExists = async (categoryId) => {
  if (!categoryId) {
    return null;
  }

  const category = await Category.findOne({ _id: categoryId, active: true });
  if (!category) {
    const error = new Error("Categoria no encontrada");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

const listProducts = async (req, res, next) => {
  try {
    const { filter, sort } = buildProductFilter(req.query);
    const { page, limit, skip } = req.pagination;

    if (req.query.active === undefined) {
      filter.active = true;
    }

    const [total, products] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sort)
        .skip(skip)
        .limit(limit)
    ]);

    return sendSuccess(res, {
      data: products,
      pagination: {
        total,
        page,
        limit,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true }).populate(
      "category",
      "name slug description"
    );

    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    return sendSuccess(res, { data: product });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const { name, description, sku, price, stock, category, tags, active } = req.body;

    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      const error = new Error("El SKU ya existe");
      error.statusCode = 409;
      throw error;
    }

    await ensureCategoryExists(category);

    const product = await Product.create({
      name,
      description,
      sku,
      price,
      stock,
      category: category || null,
      tags,
      active
    });

    const populatedProduct = await Product.findById(product._id).populate("category", "name slug");

    return sendSuccess(res, {
      statusCode: 201,
      message: "Producto creado correctamente",
      data: populatedProduct
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true });

    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const { name, description, sku, price, stock, category, tags, active } = req.body;

    if (sku && sku !== product.sku) {
      const skuExists = await Product.findOne({ sku });
      if (skuExists) {
        const error = new Error("El SKU ya existe");
        error.statusCode = 409;
        throw error;
      }
    }

    if (category !== undefined) {
      await ensureCategoryExists(category);
      product.category = category || null;
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (sku !== undefined) product.sku = sku;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    if (tags !== undefined) product.tags = tags;
    if (active !== undefined) product.active = active;

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate("category", "name slug");

    return sendSuccess(res, {
      message: "Producto actualizado correctamente",
      data: updatedProduct
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true });

    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    product.active = false;
    await product.save();

    return sendSuccess(res, {
      message: "Producto desactivado correctamente",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const updateProductStock = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true });

    if (!product) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      throw error;
    }

    product.stock = req.body.stock;
    await product.save();

    return sendSuccess(res, {
      message: "Stock actualizado correctamente",
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock
};
